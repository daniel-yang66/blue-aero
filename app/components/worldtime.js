"use client";
import AirportWeather from "../api/airportWeather";
import WorldView from "./worldtimemap";
import tz_lookup from "tz-lookup";
import Clock from "./clock";
import { useState, useEffect, useRef, Suspense } from "react";
import Loading from "./loading";

export default function WorldTimes({ wind, as }) {
  const [data, setData] = useState([]);
  const [airports, setAirports] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [winds, setWinds] = useState([]);
  const [text, setText] = useState("");
  const lastUpdate = useRef(Date.now());

  useEffect(() => {
    const favorites = localStorage.getItem("blueaero-airports")
      ? JSON.parse(localStorage.getItem("blueaero-airports"))
      : [];
    setAirports(favorites);
  }, []);
  useEffect(() => {
    let wAloft;
    let wAloftParsed = [];
    wAloft = wind[0].split("\n");
    setText(wAloft);
    const coords = wind[1];
    wAloft = wAloft.filter((item) => item.length > 0);
    wAloft = wAloft.forEach((item) => {
      let newArr = [];
      item = item.split(" ");
      item.forEach((str) => {
        if (str.length > 0) {
          newArr.push(str);
        }
      });
      wAloftParsed.push(newArr);
    });
    wAloftParsed.forEach((info) => {
      const point = coords.filter((coord) => {
        return coord.id === info[0];
      });
      point[0] ? info.push(point[0].lat) : "";
      point[0] ? info.push(point[0].lon) : "";
    });
    wAloftParsed = wAloftParsed.filter((arr) => {
      return arr.length >= 7 && arr[0] !== "FT" && arr[0] !== "VALID";
    });
    setWinds(wAloftParsed);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const collected = await Promise.all(
        airports.map(async (airp) => {
          const info = await AirportWeather(airp);
          const lat = info["info"]["latitude"];
          const lon = info["info"]["longitude"];
          const tz = tz_lookup(lat, lon);
          const rules = info["flight_rules"];
          const temp = info["temperature"];
          const name = info["info"]["iata"]
            ? `${info["info"]["icao"]}/${info["info"]["iata"]}`
            : info["info"]["icao"];
          const city = info["info"]["city"];
          const units = info["units"]["temperature"];

          return {
            lat: lat,
            lon: lon,
            name: name,
            tz: tz,
            rules: rules,
            temp: temp["value"],
            city: city,
            units: units,
          };
        })
      );

      setData(collected);
    };

    fetchData();
  }, [airports, trigger]);

  useEffect(() => {
    const interval = setInterval(() => {
      if ((Date.now() - lastUpdate.current) / 1000 >= 1200) {
        setTrigger((prevTrigger) => !prevTrigger);
        lastUpdate.current = Date.now();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-screen h-[85vh] grid justify-items-center">
        <div className="rounded-md h-[35vh] md:h-[35vh] w-[95%] md:w-[80%]">
          <WorldView airports={data} wind={winds} text={text} asig={as} />
        </div>
        <div className="flex gap-2 overflow-auto h-[45vh] md:h-[50vh] w-[95vw] md:w-[80%]">
          {data.length > 0 ? (
            data.map((info) => {
              return (
                <Clock
                  key={info["name"]}
                  timezone={info["tz"]}
                  airport={info["name"]}
                  city={info["city"]}
                  lat={info["lat"]}
                  lon={info["lon"]}
                />
              );
            })
          ) : (
            <p className="grid text-2xl font-bold text-neutral-300 self-center m-auto">
              No Airports Added
            </p>
          )}
        </div>
      </div>
    </Suspense>
  );
}
