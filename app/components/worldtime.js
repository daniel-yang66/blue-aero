"use client";
import AirportWeather from "../api/airportWeather";
import WorldView from "./worldtimemap";
import { useState, useEffect, useRef, Suspense } from "react";
import Loading from "./loading";

export default function WorldTimes({ as}) {
  const [data, setData] = useState([]);
  const [airports, setAirports] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const lastUpdate = useRef(Date.now());
  useEffect(() => {
    const favorites = localStorage.getItem("blueaero-airports")
      ? JSON.parse(localStorage.getItem("blueaero-airports"))
      : [];
    setAirports(favorites);
  }, []);
 

  useEffect(() => {
    const fetchData = async () => {
      const collected = await Promise.all(
        airports.map(async (airp) => {
          const info = await AirportWeather(airp);
          const lat = info["info"]["latitude"];
          const lon = info["info"]["longitude"];
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
            rules: rules,
            temp: temp ? temp["value"] : "--",
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
        <div className="rounded-md h-[70vh] w-full">
          <WorldView
            airports={data}
            asig={as}
          />
        </div>
        
    </Suspense>
  );
}
