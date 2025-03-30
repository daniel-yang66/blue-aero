"use client";

import CurrentConditions from "./currentconditions";
import { useState } from "react";
import Notams from "./notams";
import Performance from "./performance";

export default function Display({ airportCode, stored }) {
  const [display, setDisplay] = useState("weather");

  if (display === "weather") {
    return (
      <div className="mb-2">
        <CurrentConditions airportCode={airportCode} stored={stored} />

        <div className="flex gap-2 mt-2 justify-self-center h-[8%]">
          <button
            onClick={() => setDisplay("weather")}
            className={`grid items-center justify-items-center w-20 h-full flex gap-2 font-semibold text-sm md:text-md items-center mt-[0.5vh]  rounded-md text-neutral-800 ${
              display === "weather" ? "bg-blue-500" : "bg-blue-400"
            }`}
          >
            Weather
          </button>

          <button
            onClick={() => setDisplay("notams")}
            className={`grid justify-items-center items-center w-32 h-full flex gap-2 font-semibold text-sm md:text-md text-neutral-800 mt-[0.5vh] bg-blue-400 rounded-md ${
              display === "notams" ? "bg-blue-500" : "bg-blue-400"
            }`}
          >
            NOTAM/ATIS
          </button>
          <button
            onClick={() => setDisplay("performance")}
            className={`grid justify-items-center items-center w-24 h-full flex gap-2 font-semibold text-sm md:text-md text-neutral-800 mt-[0.5vh] bg-blue-400 rounded-md ${
              display === "performance" ? "bg-blue-500" : "bg-blue-400"
            }`}
          >
            Peformance
          </button>
        </div>
      </div>
    );
  }
  if (display === "notams") {
    return (
      <div className="mb-2">
        <Notams />

        <div className="flex gap-2 mt-2 justify-self-center h-[8%]">
          <button
            onClick={() => setDisplay("weather")}
            className={`grid items-center justify-items-center w-20 h-full flex gap-2 font-semibold text-sm md:text-md items-center mt-[0.5vh]  rounded-md text-neutral-800 ${
              display === "weather" ? "bg-blue-500" : "bg-blue-400"
            }`}
          >
            Weather
          </button>

          <button
            onClick={() => setDisplay("notams")}
            className={`grid justify-items-center items-center w-32 h-full flex gap-2 font-semibold text-sm md:text-md text-neutral-800 mt-[0.5vh] bg-blue-400 rounded-md ${
              display === "notams" ? "bg-blue-500" : "bg-blue-400"
            }`}
          >
            NOTAMs/ATIS
          </button>
          <button
            onClick={() => setDisplay("performance")}
            className={`grid justify-items-center items-center w-24 h-full flex gap-2 font-semibold text-sm md:text-md text-neutral-800 mt-[0.5vh] bg-blue-400 rounded-md ${
              display === "performance" ? "bg-blue-500" : "bg-blue-400"
            }`}
          >
            Peformance
          </button>
        </div>
      </div>
    );
  } else if (display === "performance") {
    return (
      <div className="mb-2">
        <Performance />

        <div className="flex gap-2 mt-2 justify-self-center h-[8%]">
          <button
            onClick={() => setDisplay("weather")}
            className={`grid items-center justify-items-center w-20 h-full flex gap-2 font-semibold text-sm md:text-md items-center mt-[0.5vh]  rounded-md text-neutral-800 ${
              display === "weather" ? "bg-blue-500" : "bg-blue-400"
            }`}
          >
            Weather
          </button>

          <button
            onClick={() => setDisplay("notams")}
            className={`grid justify-items-center items-center w-32 h-full flex gap-2 font-semibold text-sm md:text-md text-neutral-800 mt-[0.5vh] bg-blue-400 rounded-md ${
              display === "notams" ? "bg-blue-500" : "bg-blue-400"
            }`}
          >
            NOTAMs/ATIS
          </button>
          <button
            onClick={() => setDisplay("performance")}
            className={`grid justify-items-center items-center w-24 h-full flex gap-2 font-semibold text-sm md:text-md text-neutral-800 mt-[0.5vh] bg-blue-400 rounded-md ${
              display === "performance" ? "bg-blue-500" : "bg-blue-400"
            }`}
          >
            Peformance
          </button>
        </div>
      </div>
    );
  }
}
