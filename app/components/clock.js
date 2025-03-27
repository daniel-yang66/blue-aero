"use client";
import "../globals.css";
import { DateTime } from "luxon";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import { useState, useEffect } from "react";

export default function Clock({ timezone, airport, city, lat, lon }) {
  const [time, setTime] = useState("--:--");
  const [date, setDate] = useState("---");
  const [hourHand, setHourHand] = useState();
  const [minHand, setMinHand] = useState();
  const [secHand, setSecHand] = useState();
  const [ticks, setTicks] = useState([]);

  const offset = Math.round(DateTime.now().setZone(timezone).o / 60);
  let rise = getSunrise(lat, lon);
  let set = getSunset(lat, lon);

  rise = DateTime.fromJSDate(rise, { zone: timezone });
  set = DateTime.fromJSDate(set, { zone: timezone });

  rise = `${String(rise.hour).padStart(2, "0")}:${String(rise.minute).padStart(
    2,
    "0"
  )}`;
  set = `${String(set.hour).padStart(2, "0")}:${String(set.minute).padStart(
    2,
    "0"
  )}`;

  const timeConversion = function (tz, hfunc, mfunc, sfunc) {
    const timeData = DateTime.now().setZone(tz);
    const hour = String(timeData.hour).padStart(2, "0");
    const min = String(timeData.minute).padStart(2, "0");
    const seconds = new Date().getSeconds();

    setTime(`${hour}:${min}`);
    setDate(`${timeData.monthShort} ${timeData.day}`);
    hfunc(hour * 30 + min / 2);
    mfunc(min * 6 + seconds / 10);
    sfunc(seconds * 6);
  };
  useEffect(() => {
    let collected = [];
    for (let i = 0; i < 60; i++) {
      const degrees = i * 6;
      const isHourTick = i % 5 === 0;
      collected.push(
        <div
          key={i}
          className={`tick ${isHourTick ? "hour" : ""}`}
          style={{ transform: `rotate(${degrees}deg)` }}
        ></div>
      );
    }
    setTicks(collected);
  }, []);

  useEffect(() => {
    if (!timezone) return;
    const interval = setInterval(() => {
      timeConversion(timezone, setHourHand, setMinHand, setSecHand);
    }, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="grid gap-1 h-[128px] justify-items-center items-center md:mt-12">
      <div className="clock">
        {ticks.map((tick) => {
          return tick;
        })}
        <div
          className="hand hour-hand"
          style={
            hourHand !== 0
              ? {
                  transform: `rotate(${hourHand}deg)`,
                  transition: "all 1s linear",
                }
              : { transform: `rotate(${hourHand}deg)`, transition: "none" }
          }
        ></div>
        <div
          className="hand minute-hand"
          style={
            minHand !== 0
              ? {
                  transform: `rotate(${minHand}deg)`,
                  transition: "all 1s linear",
                }
              : { transform: `rotate(${minHand}deg)`, transition: "none" }
          }
        ></div>
        <div
          className="hand second-hand"
          style={
            secHand !== 0
              ? {
                  transform: `rotate(${secHand}deg)`,
                  transition: "all 1s linear",
                }
              : { transform: `rotate(${secHand}deg)`, transition: "none" }
          }
        ></div>
        <div className="dot"></div>
      </div>
      <div className="text-md text-blue-400 font-semibold">
        {time} | {date}
      </div>
      <div className="flex gap-2">
        <div className="flex gap-1 items-center justify-content-center">
          <img src="/sunrise.png" width={35} height={35} alt="sunrise" />
          <p className="text-md text-neutral-300 font-semibold">{rise}</p>
        </div>{" "}
        |
        <div className="flex gap-1 items-center justify-content-center">
          <img src="/sunset.png" width={35} height={35} alt="sunset" />
          <p className="text-md text-neutral-300 font-semibold">{set}</p>
        </div>
      </div>

      <p className="text-md text-neutral-300 font-semibold">
        {offset < 0 ? `GMT ${offset}` : `GMT +${offset}`}
      </p>
      <div className="flex gap-2 items-center">
        <img src="/icon.png" width={30} height={30} alt="plane" />
        <p className="text-md text-neutral-300 font-semibold">
          {airport} - {city}
        </p>
      </div>
    </div>
  );
}
