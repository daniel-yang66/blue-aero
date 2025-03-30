"use client";
import AirportWeather from "../api/airportWeather";
import { useState, useEffect, useRef, Suspense } from "react";
import Loading from "./loading";
import AirSig from "../api/airsig";
import Obstacles from "../api/obstacles";
import { getBoundsOfDistance } from "geolib";
import Map from "./worldtimemap";

export default function WorldTimes({ airport }) {
  const [data, setData] = useState(null);
  const [as, setAs] = useState(null);
  const [obs, setObs] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const lastUpdate = useRef(Date.now());

  async function fetchInfo() {
    const airportInfo = await AirportWeather(airport);
    const asData = await AirSig();

    let dataObj = {};
    dataObj.name = `${airportInfo["info"]["icao"]}/${airportInfo["info"]["iata"]}`;
    dataObj.lat = airportInfo["info"]["latitude"];
    dataObj.lon = airportInfo["info"]["longitude"];

    const boundingCoords = getBoundsOfDistance(
      {
        latitude: airportInfo["info"]["latitude"],
        longitude: airportInfo["info"]["longitude"],
      },
      5000
    );

    const boundingCoordsWide = getBoundsOfDistance(
      {
        latitude: airportInfo["info"]["latitude"],
        longitude: airportInfo["info"]["longitude"],
      },
      43600
    );

    const wideRadiusObsData = await Obstacles(
      boundingCoordsWide[0].latitude,
      boundingCoordsWide[0].longitude,
      boundingCoordsWide[1].latitude,
      boundingCoordsWide[1].longitude
    );

    const obsData = await Obstacles(
      boundingCoords[0].latitude,
      boundingCoords[0].longitude,
      boundingCoords[1].latitude,
      boundingCoords[1].longitude
    );

    setData(dataObj);
    setAs(asData);
    setObs([obsData, wideRadiusObsData]);
  }

  useEffect(() => {
    if (!airport) return;
    fetchInfo();
  }, [airport]);

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
      <div className="rounded-md h-[35vh] md:h-[35vh] w-[95%] md:w-[80%]">
        <Map
          airport={data}
          asig={as}
          obs={obs ? obs[0] : null}
          obsWideRadius={obs ? obs[1] : null}
        />
      </div>
    </Suspense>
  );
}
