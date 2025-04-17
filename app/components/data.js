"use client";

import { useEffect, useState } from "react";
import "../globals.css";
import clsx from "clsx";

export default function Runways({ airportCode, stored }) {
  const [runwayData, setRunwayData] = useState([]);
  const [windData, setWindData] = useState([]);
  const [alt, setAlt] = useState([]);
  const [unit, setUnit] = useState("");

  useEffect(() => {
    sessionStorage.getItem(`${airportCode}-runways`)
      ? setRunwayData(
          JSON.parse(sessionStorage.getItem(`${airportCode}-runways`))
        )
      : setRunwayData([]);

    sessionStorage.getItem(`${airportCode}-wind`)
      ? setWindData(JSON.parse(sessionStorage.getItem(`${airportCode}-wind`)))
      : setWindData([]);

    sessionStorage.getItem(`${airportCode}-alt`)
      ? setAlt(JSON.parse(sessionStorage.getItem(`${airportCode}-alt`)))
      : setAlt([]);

    sessionStorage.getItem(`${airportCode}-unit`)
      ? setUnit(JSON.parse(sessionStorage.getItem(`${airportCode}-unit`)))
      : setUnit("");
  }, [airportCode, stored]);

  let windDir,
    windSpeed = 0;
  if (windData.length !== 0) {
    windSpeed = windData[2] ? windData[2]["value"] : windData[0]["value"];
    windDir = windData[1] ? windData[1]["value"] : 0;
  }

  return (
    <div className="relative h-full w-[96vw] md:w-[65vw] overflow-auto bg-zinc-800 rounded-lg grid gap-4 text-zinc-300 font-bold justify-items-center p-2 text-sm z-[4]">
      <div className="flex gap-4">
        <p>Density Alt: {alt.length !== 0 ? alt[0] : "--ft"}</p> |
        <p>Pressure Alt: {alt.length !== 0 ? alt[1] : "--ft"}</p>
      </div>
      {runwayData
        ? runwayData.map((rwy) => {
            const hwind = windDir
              ? Math.sin(((windDir - rwy.bearing1) * Math.PI) / 180)
              : 0;
            const vwind = windDir
              ? Math.cos(((windDir - rwy.bearing1) * Math.PI) / 180)
              : 0;

            return (
              <div
                key={rwy.ident1}
                className={clsx(
                  "flex items-center w-[75%] gap-1 relative mb-4",
                  {
                    "-ml-[25vw] md:-ml-[12vw]": hwind !== 0 && vwind !== 0,
                    "-ml-[18vw] md:-ml-[5vw]":
                      (hwind !== 0 && vwind === 0) ||
                      (hwind === 0 && vwind !== 0),
                  }
                )}
              >
                <div className="h-10 min-w-full">
                  <div className="h-full w-full bg-zinc-800 rounded px-1 flex justify-between items-center">
                    <div className="h-10 w-6 grid gap-1 items-center">
                      {[1, 2, 3, 4].map((line) => {
                        return (
                          <div
                            key={line}
                            className="h-1 w-4 bg-zinc-300"
                          ></div>
                        );
                      })}
                    </div>
                    <div className="rotate-90 font-bold">{rwy.ident1}</div>

                    <p className="dashed-border"></p>

                    <div className="-rotate-90 font-bold">{rwy.ident2}</div>
                    <div className="h-10 w-6 grid gap-1 items-center">
                      {[1, 2, 3, 4].map((line) => {
                        return (
                          <div
                            key={line}
                            className="h-1 w-4 bg-zinc-100"
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-md">{`${rwy.width_ft.toLocaleString()} x ${rwy.length_ft.toLocaleString()}ft | ${
                    rwy.surface ? rwy.surface : "N/A"
                  } ${rwy.lights ? "| lighted" : ""}`}</p>
                </div>
                <div className="flex gap-2 md:gap-4">
                  {Math.abs(Math.round(windSpeed * hwind)) !== 0 ? (
                    <div className="flex items-center gap-1">
                      <div
                        style={{
                          transform: `rotate(${hwind < 0 ? -90 : 90}deg)`,
                        }}
                        className="w-0 h-0 border-t-8 border-b-8 border-r-12 border-solid border-t-transparent border-b-transparent border-r-green-400 rounded"
                      ></div>
                      <p>{`${Math.abs(
                        Math.round(windSpeed * hwind)
                      )}${unit}`}</p>
                    </div>
                  ) : (
                    <></>
                  )}
                  {Math.abs(Math.round(windSpeed * vwind)) !== 0 ? (
                    <div className="flex items-center gap-1">
                      <div
                        style={{
                          transform: `rotate(${vwind > 0 ? 0 : 180}deg)`,
                        }}
                        className="w-0 h-0 border-t-8 border-b-8 border-r-12 border-solid border-t-transparent border-b-transparent border-r-green-400 rounded"
                      ></div>
                      <p>{`${Math.abs(
                        Math.round(windSpeed * vwind)
                      )}${unit}`}</p>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            );
          })
        : ""}
    </div>
  );
}
