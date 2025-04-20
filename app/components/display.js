"use client";

import CurrentConditions from "./currentconditions";
import { useState } from "react";
import Performance from "./performance";

export default function Display({ airportCode, route }) {
  const [display, setDisplay] = useState("weather");

  if (display === "weather") {
    return (
      <div className="mb-4">
        {!route ? (
          <CurrentConditions airportCode={airportCode} type="single" />
        ) : (
          <div className="h-full grid gap-2 md:flex md:gap-[4vw]">
            <CurrentConditions airportCode={route[0]} type="route" />
            <CurrentConditions airportCode={route[1]} type="route" />
          </div>
        )}

        <div className="flex gap-2 justify-self-center h-[8%]">
          <button
            onClick={() => setDisplay("weather")}
            className={`grid items-center justify-items-center w-20 h-8 h-full flex gap-2 font-bold text-sm md:text-md items-center mt-[0.5vh]  rounded-md text-zinc-800 bg-green-400`}
          >
            Weather
          </button>

          <button
            onClick={() => setDisplay("performance")}
            className={`grid justify-items-center items-center w-24 h-8 h-full flex gap-2 font-bold text-sm md:text-md text-zinc-800 mt-[0.5vh] bg-zinc-400 rounded-md bg-zinc-400`}
          >
            Peformance
          </button>
        </div>
      </div>
    );
  } else if (display === "performance") {
    return (
      <div className="mb-4">
        <Performance />

        <div className="flex gap-2 justify-self-center h-[8%]">
          <button
            onClick={() => setDisplay("weather")}
            className={`grid items-center justify-items-center w-20 h-8 h-full flex gap-2 font-bold text-sm md:text-md items-center mt-[0.5vh]  rounded-md text-zinc-800 bg-zinc-400`}
          >
            Weather
          </button>

          <button
            onClick={() => setDisplay("performance")}
            className={`grid justify-items-center items-center w-24 h-8 h-full flex gap-2 font-bold text-sm md:text-md text-zinc-800 mt-[0.5vh] bg-zinc-400 rounded-md bg-green-400`}
          >
            Peformance
          </button>
        </div>
      </div>
    );
  }
}
