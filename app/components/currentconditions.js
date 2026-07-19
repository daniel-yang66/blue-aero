"use client";

import "../globals.css";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DateTime } from "luxon";
import tz_lookup from "tz-lookup";
import clsx from "clsx";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import Loading from "./loading";
import AirportWeather from "../api/airportWeather";
import AtisInfo from "./atisInfo";
import Forecast from "./forecast";
import Clouds from "./cloud";

export default function CurrentConditions({ airportCode, stored }) {
  const [weather, setWeather] = useState(undefined);
  const [time, setTime] = useState("--:--, --- --");
  const [timezone, setTimezone] = useState(undefined);
  const [flightColor, setFlightColor] = useState("zinc");
  const [icon, setIcon] = useState("");
  const [phenom, setPhenom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openTaf, setOpenTaf] = useState(false);
  const [openCloud, setOpenCloud] = useState(false);
  const [openAtis, setOpenAtis] = useState(false);
  const [timeSince, setTimeSince] = useState("-- min old");
  const [ceiling, setCeiling] = useState("--ft");
  const [coords, setCoords] = useState([]);
  const [sunTimes, setSunTimes] = useState([]);
  const [faveStatus, setFaveStatus] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const lastUpdate = useRef(Date.now());

  const { replace } = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  function HandleStore() {
    const params = new URLSearchParams(searchParams);
    params.set("stored", stored === "1" ? "2" : "1");
    replace(`${pathName}?${params.toString()}`);
  }

  useEffect(() => {
    if (localStorage.getItem("blueaero-airports")) {
      const faveList = JSON.parse(localStorage.getItem("blueaero-airports"));
      if (faveList.includes(airportCode)) {
        setFaveStatus(true);
      } else {
        setFaveStatus(false);
      }
    }
  }, [airportCode]);

  function HandleFaves() {
    if (!airportCode) return;
    const faveAirports = localStorage.getItem("blueaero-airports")
      ? JSON.parse(localStorage.getItem("blueaero-airports"))
      : [];

    if (!faveAirports.includes(airportCode)) {
      localStorage.setItem(
        "blueaero-airports",
        JSON.stringify([...faveAirports, airportCode]),
      );
      setFaveStatus(true);
    } else {
      localStorage.setItem(
        "blueaero-airports",
        JSON.stringify(
          faveAirports.filter((airp) => {
            return airp !== airportCode;
          }),
        ),
      );
      setFaveStatus(false);
    }
  }

  const timeConversion = function (tz) {
    const timeData = DateTime.now().setZone(tz);
    const hour = String(timeData.hour).padStart(2, "0");
    const min = String(timeData.minute).padStart(2, "0");
    setTime(`${hour}:${min}, ${timeData.monthShort} ${timeData.day}`);
  };

  const timeSinceReport = function () {
    const reportTime = DateTime.fromISO(weather["time"]["dt"], {
      zone: "UTC",
    }).ts;
    const diff = Math.round((Date.now() - reportTime) / 60000);

    setTimeSince(`${diff} min old`);
  };

  async function getWeather(text) {
    try {
      setLoading(true);

      if (!text) {
        setLoading(false);
        setIcon("");
        setTime("--:--, --- --");
        setTimeSince("-- min old");
        setTimezone(undefined);
        setFlightColor("zinc");
        setPhenom([]);
        setCeiling("--ft");
        return;
      }

      const data = text ? await AirportWeather(text) : undefined;
      let conditions = [];
      if (data) {
        const lat = data["info"]["latitude"];
        const lon = data["info"]["longitude"];
        setCoords([lon, lat]);

        if (data["flight_rules"] === "VFR") setFlightColor("green");
        else if (data["flight_rules"] === "MVFR") setFlightColor("blue");
        else if (data["flight_rules"] === "IFR") setFlightColor("red");
        else if (data["flight_rules"] === "LIFR") setFlightColor("purple");

        if (sessionStorage.getItem(`${airportCode}-wind`)) {
          sessionStorage.removeItem(`${airportCode}-wind`);
        }

        sessionStorage.setItem(
          `${airportCode}-wind`,
          JSON.stringify([
            data["wind_speed"],
            data["wind_direction"],
            data["wind_gust"],
          ]),
        );
        if (sessionStorage.getItem(`${airportCode}-runways`)) {
          sessionStorage.removeItem(`${airportCode}-runways`);
        }

        sessionStorage.setItem(
          `${airportCode}-runways`,
          JSON.stringify(data["info"]["runways"]),
        );
        if (sessionStorage.getItem(`${airportCode}-unit`)) {
          sessionStorage.removeItem(`${airportCode}-unit`);
        }

        sessionStorage.setItem(
          `${airportCode}-unit`,
          JSON.stringify(data["units"]["wind_speed"]),
        );

        if (sessionStorage.getItem(`${airportCode}-alt`)) {
          sessionStorage.removeItem(`${airportCode}-alt`);
        }

        sessionStorage.setItem(
          `${airportCode}-alt`,
          JSON.stringify([
            `${data["density_altitude"]}${data["units"]["altitude"]}`,
            `${data["pressure_altitude"]}${data["units"]["altitude"]}`,
          ]),
        );

        HandleStore();

        const tz = tz_lookup(lat, lon);
        setTimezone(tz);

        let sunrise = getSunrise(lat, lon);
        let sunset = getSunset(lat, lon);

        sunrise = DateTime.fromJSDate(sunrise, { zone: tz });
        sunset = DateTime.fromJSDate(sunset, { zone: tz });

        sunrise = `${String(sunrise.hour).padStart(2, "0")}:${String(
          sunrise.minute,
        ).padStart(2, "0")}`;
        sunset = `${String(sunset.hour).padStart(2, "0")}:${String(
          sunset.minute,
        ).padStart(2, "0")}`;

        const currentTime = `${String(DateTime.now().setZone(tz).hour).padStart(
          2,
          "0",
        )}:${String(DateTime.now().setZone(tz).minute).padStart(2, "0")}`;

        setSunTimes([sunrise, sunset]);

        let night = true;
        if (currentTime > sunrise && currentTime < sunset) night = false;

        data["wx_codes"].forEach((code) => {
          conditions.push(code["value"]);
        });
        setPhenom(conditions);

        data["clouds"].forEach((cloud) => {
          if (
            (cloud["type"] === "BKN" ||
              cloud["type"] === "FEW" ||
              cloud["type"] === "SCT") &&
            !night
          ) {
            setIcon("part-day");
          } else if (
            (cloud["type"] === "BKN" ||
              cloud["type"] === "FEW" ||
              cloud["type"] === "SCT") &&
            night
          ) {
            setIcon("part-night");
          } else if (cloud["type"] === "OVC" || cloud["type"] === "VV") {
            setIcon("cloud");
          } else if (!night) {
            setIcon("clear-day");
          } else if (night) {
            setIcon("clear-night");
          }
        });
        if (data["clouds"].length === 0) {
          if (!night) {
            setIcon("clear-day");
          } else if (night) {
            setIcon("clear-night");
          }
        }
        setCeiling("--");

        data["clouds"].some((cloud) => {
          if (
            cloud["type"] === "BKN" ||
            cloud["type"] === "OVC" ||
            cloud["type"] === "VV"
          ) {
            setCeiling(
              cloud["altitude"]
                ? Math.round(cloud["altitude"] * 100).toLocaleString()
                : "--" + data["units"]["altitude"],
            );

            return true;
          }
        });
      }
      setWeather(data);
    } catch {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getWeather(airportCode);
  }, [airportCode, trigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!timezone) return;
      timeConversion(timezone);
      timeSinceReport();
      if ((Date.now() - lastUpdate.current) / 1000 >= 1200) {
        setTrigger((prevTrigger) => !prevTrigger);
        lastUpdate.current = Date.now();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [airportCode, trigger, timezone, weather]);

  if (!loading) {
    return (
      <>
        <div className="w-[96vw] md:w-[65vw] h-full bg-zinc-800 p-2 relative rounded-md grid justify-items-center z-[5] overflow-auto text-zinc-300 relative">
          <div className="absolute top-1 left-2 md:left-4 grid items-center gap-1 md:gap-0">
            <div className="flex items-center gap-1 mb-[5px]">
              <img src="/icon.png" width={25} height={25} alt="plane" />

              <h1 className="grid font-bold text-sm md:text-xl ml-1">
                {weather
                  ? `${
                      weather["info"]["iata"]
                        ? `${weather["info"]["icao"]}/${weather["info"]["iata"]}`
                        : weather["info"]["icao"]
                    }`
                  : "----"}
              </h1>
              <h1 className="font-bold text-sm md:text-xl">
                {weather ? `| ${weather["info"]["city"]}` : "----"}
              </h1>
            </div>
            <p className="font-semibold text-xs md:text-[15px]">{timeSince}</p>
            <p className="font-semibold text-xs md:text-[15px]">
              {time} | Elev:{" "}
              {weather ? weather["info"]["elevation_ft"] + "ft" : "--ft"} | Alt:{" "}
              {weather
                ? weather["altimeter"]
                  ? weather["units"]["altimeter"] !== "hPa"
                    ? String(weather["altimeter"]["value"]).length === 2
                      ? `${weather["altimeter"]["value"]}.00`
                      : weather["altimeter"]["value"]
                    : "Q" + weather["altimeter"]["value"]
                  : "----"
                : "----"}
            </p>
            <div className="flex gap-2 mt-1 font-semibold">
              <div className="flex gap-1 items-center justify-content-center">
                <img src="/sunrise.png" width={27} height={27} alt="sunrise" />
                <p className="text-xs md:text-[15px] text-zinc-300 font-bold">
                  {sunTimes[0]}
                </p>
              </div>
              <div className="flex gap-1 items-center justify-content-center">
                <img src="/sunset.png" width={27} height={27} alt="sunset" />
                <p className="text-xs md:text-[15px] text-zinc-300 font-bold">
                  {sunTimes[1]}
                </p>
              </div>
            </div>

            <p className="text-sm md:text-md font-semibold text-yellow-400">
              {phenom.join(", ")}
            </p>
          </div>
          <div className="absolute top-0 right-0 grid gap-2 items-center">
            <div
              className={clsx(
                `w-16 md:w-20 h-[24px] grid items-center justify-items-center font-bold rounded-bl-xl text-sm md:text-md text-zinc-800`,
                {
                  "bg-green-400": flightColor === "green",
                  "bg-blue-400": flightColor === "blue",
                  "bg-red-400": flightColor === "red",
                  "bg-purple-400": flightColor === "purple",
                  "bg-zinc-400": flightColor === "zinc",
                },
              )}
            >
              {weather ? weather["flight_rules"] : "---"}
            </div>
          </div>
          <div className="absolute w-[100px] top-[13%] md:top-[20%] right-[0.5%] grid gap-2 justify-content-center">
            <button
              onClick={() => {
                setOpenCloud(false);
                setOpenTaf(false);
                setOpenAtis(true);
              }}
              className="w-full h-[20px] md:h-[24px] bg-zinc-400 text-sm md:text-md font-bold grid justify-items-center items-center text-zinc-800 rounded-md mr-1 p-x-2"
            >
              ATIS
            </button>
            <button
              onClick={() => {
                setOpenCloud(false);
                setOpenAtis(false);
                setOpenTaf(true);
              }}
              className="w-full h-[20px] md:h-[24px] bg-zinc-400 text-sm md:text-md font-bold grid justify-items-center items-center text-zinc-800 rounded-md mr-1 p-x-2"
            >
              Forecast
            </button>
            <button
              onClick={() => {
                setOpenTaf(false);
                setOpenAtis(false);
                setOpenCloud(true);
              }}
              className="w-full h-[20px] md:h-[24px] bg-zinc-400 text-sm md:text-md font-bold grid justify-items-center items-center text-zinc-800 rounded-md mr-1 p-x-2"
            >
              Clouds
            </button>
          </div>
          <div className="absolute bottom-2 left-2 md:left-4 flex gap-0 md:gap-2">
            {icon ? (
              <img
                src={`/${icon}.png`}
                width={68}
                height={68}
                alt="weather icon"
              />
            ) : (
              <></>
            )}
            <h4 className="text-[18px] md:text-[23px] font-bold">{`${
              weather
                ? weather["temperature"]
                  ? weather["temperature"]["value"]
                  : "--"
                : "--"
            }\xB0${weather ? weather["units"]["temperature"] : "C"}`}</h4>
          </div>
          <div className="flex items-center justify-content-center gap-2 md:gap-4 mt-10 md:mt-0">
            <p className="font-bold text-md md:text-lg">
              {weather
                ? weather["wind_direction"]
                  ? weather["wind_direction"]["repr"] !== "VRB"
                    ? weather["wind_direction"]["value"] + "\xB0"
                    : "VRB"
                  : `0\xB0`
                : "--\xB0"}
            </p>

            <div
              className={`w-20 h-20 md:h-24 md:w-24 grid items-center justify-items-center relative rounded-full border-zinc-400 border-solid border-4`}
              style={{
                transform: `rotate(${
                  weather
                    ? weather["wind_direction"]
                      ? weather["wind_direction"]["repr"] !== "VRB"
                        ? weather["wind_direction"]["value"]
                        : 0
                      : 0
                    : 0
                }deg)`,
              }}
            >
              <img
                src={"/wind.png"}
                height={44}
                width={44}
                alt="wind"
                style={{
                  transform: `rotate(${
                    weather
                      ? weather["wind_direction"]
                        ? weather["wind_direction"]["repr"] !== "VRB"
                          ? 0 - weather["wind_direction"]["value"]
                          : 0
                        : 0
                      : 0
                  }deg)`,
                }}
              />
              <div className="arrow"></div>
            </div>
            <p className="font-bold text-md md:text-lg">
              {weather
                ? weather["wind_speed"]
                  ? !weather["wind_gust"]
                    ? weather["wind_speed"]["value"] +
                      weather["units"]["wind_speed"]
                    : `${weather["wind_speed"]["value"]}/${weather["wind_gust"]["value"]}${weather["units"]["wind_speed"]}`
                  : "--kt"
                : "--kt"}
            </p>
          </div>

          {weather ? (
            <button
              onClick={() => {
                HandleFaves();
              }}
              className={clsx(
                "absolute top-[86%] h-[20px] md:h-[20px] bg-none text-md md:text-lg font-bold grid justify-items-center items-end rounded-xl mr-1",
                {
                  "text-yellow-300": faveStatus,
                  "text-green-400": !faveStatus,
                },
              )}
            >
              {faveStatus ? "Remove from Map" : "Add to Map"}
            </button>
          ) : (
            <></>
          )}
          <div className="absolute bottom-1 right-2 md:right-4 grid items-center justify-items-center">
            <p className="text-sm md:text-lg font-bold">
              T/D Spr:{" "}
              {weather
                ? weather["temperature"]
                  ? weather["temperature"]["value"] -
                    weather["dewpoint"]["value"] +
                    `\xB0${weather["units"]["temperature"]}`
                  : "--\xB0C"
                : `--\xB0C`}
            </p>
            <p className="text-sm md:text-lg font-bold">Ceiling: {ceiling}</p>
            <p className="text-sm md:text-lg font-bold">
              Visibility:{" "}
              {weather
                ? weather["visibility"]
                  ? weather["visibility"]["value"] !== 9999
                    ? weather["visibility"]["value"]
                      ? weather["visibility"]["value"] +
                        weather["units"]["visibility"]
                      : weather["visibility"]["repr"] +
                        weather["units"]["visibility"]
                    : "Good"
                  : "--sm"
                : "--sm"}
            </p>
          </div>

          <Forecast
            airport={airportCode}
            coords={coords}
            timezone={timezone}
            open={openTaf}
            onSetOpen={setOpenTaf}
            sun={sunTimes}
          />
          <Clouds weather={weather} onSetOpen={setOpenCloud} open={openCloud} />
          <AtisInfo
            airport={airportCode}
            onSetOpen={setOpenAtis}
            open={openAtis}
          />
        </div>
      </>
    );
  } else {
    return <Loading />;
  }
}
