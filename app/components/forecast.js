"use client";
import "../globals.css";

import { useEffect, useState, useRef } from "react";
import AirportForecast from "../api/airportTaf";
import AirportHourly from "../api/airportHourly";
import { DateTime } from "luxon";
import clsx from "clsx";
import LoadingForecast from "./loadingForecast";

export default function Forecast({
  airport,
  coords,
  timezone,
  open,
  onSetOpen,
  sun,
}) {
  const [data, setData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const counter = useRef(0);
  const [zone, setZone] = useState("loc");
  const [type, setType] = useState("taf");
  const [diff, setDiff] = useState("");

  async function getForecast(text, coordinates) {
    try {
      setLoading(true);
      counter.current = 0;

      let forecast = text ? await AirportForecast(text) : undefined;
      let cleaned = [];
      let color = "slate";

      const reportTime = DateTime.fromISO(forecast["time"]["dt"], {
        zone: "UTC",
      }).ts;
      const hourDiff = Math.floor((Date.now() - reportTime) / 60000 / 60);
      const minDiff = Math.round(
        (Date.now() - reportTime) / 60000 -
          Math.floor((Date.now() - reportTime) / 60000 / 60) * 60
      );
      const diff = `TAF ${
        hourDiff !== 0 ? `${hourDiff}h` : ""
      } ${minDiff}min old`;

      if (forecast) {
        const wsUnit = forecast["units"]["wind_speed"];
        const altUnit = forecast["units"]["altitude"];
        const vUnit = forecast["units"]["visibility"];

        forecast = forecast["forecast"];

        forecast.forEach((time) => {
          let icon;
          let phenom = [];
          let ceiling = "None";
          const start = time["transition_start"]
            ? time["transition_start"]["dt"]
            : time["start_time"]["dt"];
          const end = time["end_time"]["dt"];

          const rules = time["flight_rules"];
          if (rules === "VFR") color = "green";
          else if (rules === "MVFR") color = "yellow";
          else if (rules === "IFR") color = "red";
          else if (rules === "LIFR") color = "purple";

          const ws = time["wind_speed"] ? time["wind_speed"]["value"] : "N/A";
          const wd = time["wind_direction"]
            ? time["wind_direction"]["repr"] !== "VRB"
              ? time["wind_direction"]["value"]
              : "VRB"
            : "N/A";
          const wg = time["wind_gust"] ? time["wind_gust"]["value"] : 0;
          let type = "";
          if (time["probability"])
            type = `(Prob ${time["probability"]["value"]}%)`;
          else if (time["type"] !== "FROM") type = `(${time["type"]})`;

          if (time["wx_codes"].length !== 0) {
            time["wx_codes"].forEach((code) => {
              phenom.push(code.value);
            });
          }
          phenom = phenom.join(", ");

          let startConvert = DateTime.fromISO(start, {
            zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
          startConvert = `${String(startConvert.hour).padStart(
            2,
            "0"
          )}:${String(startConvert.minute).padStart(2, "0")}`;

          let night = true;
          if (startConvert > sun[0] && startConvert < sun[1]) night = false;

          time["clouds"].forEach((cloud) => {
            if (
              (cloud["type"] === "BKN" ||
                cloud["type"] === "FEW" ||
                cloud["type"] === "SCT") &&
              !night
            ) {
              icon = "part-day";
            } else if (
              (cloud["type"] === "BKN" ||
                cloud["type"] === "FEW" ||
                cloud["type"] === "SCT") &&
              night
            ) {
              icon = "part-night";
            } else if (cloud["type"] === "OVC" || cloud["type"] === "VV") {
              icon = "cloud";
            } else if (!night) {
              icon = "clear-day";
            } else if (night) {
              icon = "clear-night";
            }
          });
          if (time["clouds"].length === 0 && type === "") {
            if (!night) {
              icon = "clear-day";
            } else if (night) {
              icon = "clear-night";
            }
          }

          time["clouds"].some((cloud) => {
            if (
              cloud["type"] === "BKN" ||
              cloud["type"] === "OVC" ||
              cloud["type"] === "VV"
            ) {
              ceiling =
                Number(`${cloud["altitude"]}00`).toLocaleString() + altUnit;
              return true;
            }
          });
          const visibility = time["visibility"]
            ? time["visibility"]["value"] !== 9999
              ? time["visibility"]["value"]
                ? time["visibility"]["value"] + vUnit
                : time["visibility"]["repr"] + vUnit
              : "Good"
            : "N/A";

          const finalData = {
            start: start,
            end: end,
            rules: rules,
            ws: ws,
            wd: wd,
            wg: wg,
            ceil: ceiling,
            vis: visibility,
            wx: phenom,
            icon: icon,
            col: color,
            type: type,
            wsUnit: wsUnit,
          };
          cleaned.push(finalData);
        });
      }

      let hourly = coordinates
        ? await AirportHourly(`${coordinates[1]},${coordinates[0]}`)
        : [];

      counter.current += 1;
      setData(cleaned);
      setHourlyData(hourly);
      setDiff(diff);
      setLoading(false);
    } catch {
      alert("Error fetching Forecast.");
    }
  }

  useEffect(() => {
    if (!airport || counter.current >= 1 || !open) return;
    getForecast(airport, coords);
  }, [airport, open]);

  if (!loading) {
    return (
      <div
        className={clsx(
          " grid-rows-[30px_auto] justify-items-center fixed w-[90vw] top-[9.5vh] md:w-[60vw] h-[77vh] left-[5vw] md:left-[20vw] bg-neutral-700 z-10 rounded-lg overflow-auto p-4 gap-2 font-semibold",
          {
            grid: open,
            hidden: !open,
          }
        )}
      >
        <div
          onClick={() => onSetOpen(false)}
          className="text-red-500 text-lg font-bold absolute top-1 right-2 hover:cursor-pointer"
        >
          X
        </div>
        {type === "taf" ? (
          <p className="text-sm md:text-md absolute top-2 left-2">{diff}</p>
        ) : (
          <></>
        )}
        <div className="flex gap-2 items-center justify-content-center mt-8 md:mt-0 mb-2">
          <select
            onChange={(e) => setZone(e.target.value)}
            className="rounded-lg w-[130px] h-[25px] bg-neutral-300 text-md  text-neutral-800"
          >
            <option value={"loc"}>Airport Time</option>
            <option value={"gmt"}>GMT</option>
          </select>
          <select
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg w-[130px] h-[25px] bg-neutral-300 text-md  text-neutral-800"
          >
            <option value={"taf"}>TAF</option>
            <option value={"hourly"}>Hourly</option>
          </select>
        </div>

        {type === "taf"
          ? data.map((info, i) => {
              let startNew = DateTime.fromISO(info["start"], {
                zone: zone !== "gmt" ? timezone : "UTC",
              });
              let endNew = DateTime.fromISO(info["end"], {
                zone: zone !== "gmt" ? timezone : "UTC",
              });

              startNew = `${startNew.monthShort} ${startNew.day}, ${String(
                startNew.hour
              ).padStart(2, "0")}:${String(startNew.minute).padStart(2, "0")}`;

              endNew = `${endNew.monthShort} ${endNew.day}, ${String(
                endNew.hour
              ).padStart(2, "0")}:${String(endNew.minute).padStart(2, "0")}`;

              return (
                <div
                  key={i}
                  className="grid items-center justify-items-center relative text-neutral-300 h-[20vh] w-[85vw] md:w-[50vw] overflow-auto bg-neutral-900 rounded-lg p-2 mt-4 md:mt-0"
                >
                  <div className="absolute top-2 left-2 grid gap-1 items-center text-sm md:text-md">
                    <div className="flex w-full gap-1">
                      <p className="text-orange-400">{info["type"]}</p>
                      <p>{startNew}</p>-<p>{endNew}</p>
                    </div>
                    <p className="text-yellow-400">{info["wx"]}</p>
                  </div>
                  {info["icon"] ? (
                    <img
                      src={`/${info["icon"]}.png`}
                      width={60}
                      height={60}
                      alt="weather icon"
                      className="bottom-4 left-4 absolute"
                    />
                  ) : (
                    <></>
                  )}
                  <p
                    className={clsx(
                      "absolute top-0 right-0 w-14 h-6 text-sm md:text-md grid items-center justify-items-center rounded-bl-xl text-neutral-800 text-sm md:text-md",
                      {
                        "bg-green-400": info["col"] === "green",
                        "bg-yellow-400": info["col"] === "yellow",
                        "bg-red-400": info["col"] === "red",
                        "bg-purple-400": info["col"] === "purple",
                        "bg-slate-400": info["col"] === "slate",
                      }
                    )}
                  >
                    {info["rules"]}
                  </p>

                  <div
                    className={clsx(
                      "items-center justify-content-center gap-2 md:gap-4",
                      {
                        hidden: info["wd"] === "N/A",
                        flex: info["wd"] !== "N/A",
                      }
                    )}
                  >
                    <p className=" text-sm md:text-md text-neutral-300">
                      {`${
                        info["wd"] !== "VRB" && info["wd"] !== "N/A"
                          ? info["wd"] + "\xB0"
                          : info["wd"]
                      }`}
                    </p>

                    <div
                      className={`w-16 h-16 grid items-center justify-items-center relative rounded-full border-slate-100 border-solid border-2`}
                      style={{
                        transform: `rotate(${
                          info["wd"] !== "N/A" ? info["wd"] : 0
                        }deg)`,
                      }}
                    >
                      <img
                        src={"/wind.png"}
                        height={40}
                        width={40}
                        alt="wind"
                        style={{
                          transform: `rotate(-${
                            info["wd"] !== "N/A" ? info["wd"] : 0
                          }deg)`,
                        }}
                      />
                      <div className="arrow"></div>
                    </div>
                    <p className=" text-sm md:text-md text-neutral-300">
                      {`${
                        info["wg"] === 0 && info["ws"] !== "N/A"
                          ? info["ws"] + info["wsUnit"]
                          : info["ws"]
                      } ${
                        info["wg"] !== 0
                          ? `G ${info["wg"]}${info["wsUnit"]}`
                          : ""
                      }`}
                    </p>
                  </div>
                  <div className="absolute bottom-2 right-2 text-md grid gap-1 items-center justify-items-center">
                    {info["type"] !== "" && info["ceil"] === "None" ? (
                      <></>
                    ) : (
                      <p>Ceiling: {info["ceil"]}</p>
                    )}
                    {info["type"] !== "" && info["vis"] === "N/A" ? (
                      <></>
                    ) : (
                      <p>Visibility: {info["vis"]}</p>
                    )}{" "}
                  </div>
                </div>
              );
            })
          : hourlyData.map((data, i) => {
              let time = DateTime.fromISO(data["time"], {
                zone: zone !== "gmt" ? timezone : "UTC",
              });
              const timeConstant = DateTime.fromISO(data["time"], {
                zone: timezone,
              });
              const timeFormated = `${time.monthShort} ${time.day}, ${String(
                time.hour
              ).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;

              let dayStatus = "1";
              if (
                `${String(timeConstant.hour).padStart(2, "0")}:${String(
                  timeConstant.minute
                ).padStart(2, "0")}` > sun[0] &&
                `${String(timeConstant.hour).padStart(2, "0")}:${String(
                  timeConstant.minute
                ).padStart(2, "0")}` < sun[1]
              ) {
                dayStatus = "0";
              }

              return (
                <div
                  key={i}
                  className="text-xs md:text-sm grid gap-2 items-center justify-items-center relative text-neutral-300 h-[20vh] md:h-[24vh] w-[85vw] md:w-[40vw] overflow-auto bg-neutral-900 rounded-lg p-2"
                >
                  <p className="font-bold">{timeFormated}</p>
                  <div className="flex gap-1">
                    <img
                      src={`${data.values.weatherCode}${dayStatus}.png`}
                      width={40}
                      height={40}
                      alt="weather icon"
                    />
                    <p>{`${Math.round(
                      (data.values.temperature - 32) * (5 / 9)
                    )}\xB0C`}</p>
                  </div>
                  <div className="grid grid-cols-2 grid-rows-2 gap-2 justify-items-center">
                    <div className="flex gap-1">
                      <img
                        src="wind.png"
                        height={22}
                        width={22}
                        alt="wind icon"
                      />
                      {
                        <p>
                          Wind: {`${data.values.windDirection}\xB0`} |{" "}
                          {`${Math.round(data.values.windSpeed * 0.869)}`}
                        </p>
                      }
                      <p className="text-orange-400">
                        {data.values.windGust &&
                        Math.round(data.values.windGust * 0.869) !==
                          Math.round(data.values.windSpeed * 0.869)
                          ? `G ${Math.round(data.values.windGust * 0.869)}`
                          : ""}
                      </p>
                      <p
                        className={clsx({
                          "text-orange-400 -ml-1":
                            data.values.windGust &&
                            Math.round(data.values.windGust * 0.869) !==
                              Math.round(data.values.windSpeed * 0.869),
                          "text-neutral-300 -ml-2":
                            !data.values.windGust ||
                            Math.round(data.values.windGust * 0.869) ===
                              Math.round(data.values.windSpeed * 0.869),
                        })}
                      >
                        kt
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <img
                        src="dew.png"
                        height={20}
                        width={20}
                        alt="dew icon"
                      />
                      <p>
                        Dew:{" "}
                        {`${Math.round(
                          (data.values.dewPoint - 32) * (5 / 9)
                        )}\xB0C`}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <img
                        src="cbase.png"
                        height={20}
                        width={20}
                        alt="cloud icon"
                      />
                      <p>
                        Base:{" "}
                        {data.values.cloudBase
                          ? `${Math.round(
                              data.values.cloudBase * 5280
                            ).toLocaleString()}ft`
                          : "N/A"}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <img
                        src="vis.png"
                        height={20}
                        width={20}
                        alt="eye icon"
                      />
                      <p>Vis: {data.values.visibility.toFixed(1)}sm</p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    );
  } else {
    return <LoadingForecast />;
  }
}
