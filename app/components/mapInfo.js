"use client";
import AirportWeather from "../api/airportWeather";
import { useState, useEffect, useRef, Suspense } from "react";
import Loading from "./loading";
import AirSig from "../api/airsig";
import Obstacles from "../api/obstacles";
import { getBoundsOfDistance, getGreatCircleBearing } from "geolib";
import Map from "./map";
import "../globals.css";

export default function Info({ airport, route }) {
  const [data, setData] = useState(null);
  const [as, setAs] = useState(null);
  const [obs, setObs] = useState(null);
  const [arrData, setArrData] = useState(null);
  const [arrObs, setArrObs] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const lastUpdate = useRef(Date.now());
  const [msa, setMsa] = useState(null);

  async function fetchAirSig() {
    const asData = await AirSig();
    setAs(asData);
  }

  async function fetchInfo(aerodrome, type) {
    const airportInfo = await AirportWeather(aerodrome);

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

    if (type === "dep" || type === "single") {
      setData(dataObj);
      setObs([obsData, wideRadiusObsData]);
    } else if (type === "arr") {
      setArrData(dataObj);
      setArrObs([obsData]);
    }

    // let q1 = [];
    // let q2 = [];
    // let q3 = [];

    // wideRadiusObsData.forEach((obs) => {
    //   const relativeBearing = getGreatCircleBearing(
    //     {
    //       latitude: airportInfo["info"]["latitude"],
    //       longitude: airportInfo["info"]["longitude"],
    //     },
    //     { latitude: obs.lat, longitude: obs.lon }
    //   );
    //   if (relativeBearing >= 0 && relativeBearing <= 120) {
    //     q1.push(obs.height ? obs.height * 3.28 : obs.elev * 3.28);
    //   } else if (relativeBearing > 120 && relativeBearing <= 240) {
    //     q2.push(obs.height ? obs.height * 3.28 : obs.elev * 3.28);
    //   } else if (relativeBearing > 240 && relativeBearing < 360) {
    //     q3.push(obs.height ? obs.height * 3.28 : obs.elev * 3.28);
    //   }
    // });
    // setMsa([
    //   Math.max(...q1) + 1000,
    //   Math.max(...q2) + 1000,
    //   Math.max(...q3) + 1000,
    // ]);
  }

  useEffect(() => {
    fetchAirSig();
    if (!airport && !route) return;
    if (route) {
      fetchInfo(route[0], "dep");
      fetchInfo(route[1], "arr");
    } else {
      fetchInfo(airport, "single");
      setArrData(null);
      setArrObs([]);
    }
  }, [airport, route]);

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
      <div className="rounded-md h-[35vh] md:h-[35vh] w-[95%] md:w-[80%] relative">
        <Map
          airport={data}
          asig={as}
          obs={obs ? obs[0] : null}
          obsWideRadius={obs ? obs[1] : null}
          arrAirport={arrData}
          arrObs={arrObs}
        />
        {/* {msa ? (
          <div className="grid justify-items-center gap-1 absolute top-[65%] right-[2%] md:right-[10%]">
            <div className="circle">
              <div className="line">
                <p className="text-sm text-zinc-300 -mt-6 font-bold">
                  {"0\xB0"}
                </p>
              </div>
              <div className="line">
                {" "}
                <p className="text-sm text-zinc-300 -mt-6 -ml-2 font-bold">
                  {"120\xB0"}
                </p>
              </div>
              <div className="line">
                {" "}
                <p className="text-sm text-zinc-300 font-bold -mt-6 -ml-2">
                  {"240\xB0"}
                </p>
              </div>

              <p className="font-bold text-zinc-300 absolute top-4 right-1 rotate-[45deg] text-sm">
                {Math.round(msa[0])}
              </p>
              <p className="font-bold text-zinc-300 absolute bottom-2 left-6 text-sm">
                {Math.round(msa[1])}
              </p>
              <p className="font-bold text-zinc-300 absolute top-4 left-1 -rotate-[45deg] text-sm">
                {Math.round(msa[2])}
              </p>
            </div>
            <p className="text-blue-300 font-bold">MSA</p>
          </div>
        ) : (
          <></>
        )} */}
      </div>
    </Suspense>
  );
}
