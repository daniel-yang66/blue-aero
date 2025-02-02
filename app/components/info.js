"use client";
import clsx from "clsx";
import { useState } from "react";

export default function Stats({ dep, arr, cty, status, onSetOpen }) {
  const [type, setType] = useState("dep");
  if (status !== "open") return;

  let data = type === "dep" ? dep : arr;
  let filtered = [];
  let times = [];
  let intl = 0;
  let dom = 0;
  let shortDelay = 0;
  let longDelay = 0;
  let timeBetween = 0;

  try {
    data.forEach((flight) => {
      if (flight.flight.time.scheduled) {
        const time =
          type === "dep"
            ? flight.flight.time.scheduled.departure
            : flight.flight.time.scheduled.arrival;
        if (time > Date.now() / 1000 && time <= Date.now() / 1000 + 6 * 3600) {
          filtered.push(flight);
          times.push(time);
        }
      }
    });

    times
      .sort((a, b) => a - b)
      .forEach((time, i) => {
        i !== times.length - 1
          ? (timeBetween += (times[i + 1] - time) / 60)
          : (timeBetween += 0);
      });

    filtered.forEach((flight) => {
      if (type === "dep") {
        if (
          flight.flight.airport.destination &&
          flight.flight.airport.destination.position.country &&
          flight.flight.airport.destination.position.country.id !== cty
        ) {
          intl += 1;
        } else {
          dom += 1;
        }
      } else {
        if (
          flight.flight.airport.origin &&
          flight.flight.airport.origin.position.country &&
          flight.flight.airport.origin.position.country.id !== cty
        ) {
          intl += 1;
        } else {
          dom += 1;
        }
      }
      if (flight.flight.status && flight.flight.status.icon === "yellow")
        shortDelay += 1;
      else if (flight.flight.status && flight.flight.status.icon === "red")
        longDelay += 1;
    });
  } catch {
    alert("An error occurred.");
  }

  return (
    <div
      className={clsx(
        "fixed grid-rows-[15%_60%] w-[95vw] md:w-[45vw] h-[35vh] md:h-[40vh] bg-neutral-800 text-neutral-300 font-semibold justify-items-center rounded-lg left-[2.5vw] md:left-[30vw] top-[20vh] p-2 text-lg md:text-xl border-solid border-2 border-neutral-500 overflow-auto",
        {
          grid: status === "open",
          hidden: status !== "open",
        }
      )}
    >
      <div
        onClick={() => onSetOpen("close")}
        className="text-red-500 text-lg font-bold absolute top-1 right-2 hover:cursor-pointer"
      >
        X
      </div>
      <div className="grid justify-items-center h-full">
        <select
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg w-[150px] h-[25px] bg-neutral-300 text-neutral-800 font-semibold"
        >
          <option value={"dep"}>Departures</option>
          <option value={"arr"}>Arrivals</option>
        </select>
      </div>
      <div className="grid h-full justify-items-center">
        <h2 className="text-yellow-400">Delays</h2>
        <div className="flex gap-2 mb-4">
          <p>
            Short <sub>{"<45min"}</sub> --{" "}
            {((shortDelay / (intl + dom)) * 100).toFixed(1)}%
          </p>{" "}
          |
          <p>
            Long <sub>{">45min"}</sub> --{" "}
            {((longDelay / (intl + dom)) * 100).toFixed(1)}%
          </p>
        </div>
        <p className="mb-4">
          Avg Flight Gap:{" "}
          {timeBetween / times.length !== 0
            ? Math.abs(timeBetween / times.length).toFixed(0)
            : Math.abs(timeBetween / times.length).toFixed(1)}
          min
        </p>
        <h2 className="text-yellow-400">Flight Counts</h2>
        <p>International: {intl}</p>
        <p>Domestic: {dom}</p>
      </div>
    </div>
  );
}
