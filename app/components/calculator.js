"use client";
import { useState } from "react";

export default function FlightNav() {
  const [tc, setTc] = useState("");
  const [tas, setTas] = useState("");
  const [wd, setWd] = useState("");
  const [ws, setWs] = useState("");
  const [wca, setWca] = useState(undefined);
  const [dis, setDis] = useState("");
  const [flow, setFlow] = useState("");
  const [heading, setHeading] = useState(undefined);
  const [gs, setGs] = useState(undefined);
  const [ete, setEte] = useState(undefined);
  const [fuel, setFuel] = useState(undefined);

  function XW(dir, track, speed) {
    return Math.sin(((dir - track) * Math.PI) / 180) * speed;
  }

  function WCA(cross, airspeed) {
    let angle = (Math.asin(Math.abs(cross) / airspeed) * 180) / Math.PI;
    cross > 0 ? (angle = angle) : (angle = 0 - angle);

    return angle;
  }
  function Heading(course, degrees) {
    return course + degrees;
  }

  function VWind(dir, head, speed) {
    return Math.cos(((dir - head) * Math.PI) / 180) * speed > 0
      ? 0 - Math.cos(((dir - head) * Math.PI) / 180) * speed
      : Math.cos(((dir - head) * Math.PI) / 180) * speed;
  }

  function GS(airspeed, vwind) {
    return airspeed + vwind;
  }
  function ETE(gspeed, distance) {
    if (!distance || distance === "") return undefined;
    let time = distance / gspeed;
    const hours = Math.floor(time);
    const min = Math.round((time - hours) * 60);
    return `${hours}h ${min}m,${time}`;
  }
  function FuelReq(flow, time) {
    if (!flow || flow === "" || !time || time === "") return undefined;

    return time * flow;
  }

  function HandleClick(course, wdir, wspeed, truespeed) {
    if (
      course === "" ||
      !course ||
      wdir === "" ||
      !wdir ||
      wspeed === "" ||
      !wspeed ||
      truespeed === "" ||
      !truespeed
    )
      return;
    const crosswind = XW(wdir, course, wspeed);
    const correction = WCA(crosswind, truespeed);
    const heading = Heading(course, correction);
    const htwind = VWind(wdir, heading, wspeed);
    const gspeed = GS(truespeed, htwind);
    const time = ETE(gspeed, dis);
    const fuelreq = time ? FuelReq(flow, +time.split(",")[1]) : undefined;

    setWca(correction);
    setHeading(heading);
    setGs(gspeed);
    setEte(time);
    setFuel(fuelreq);
  }

  return (
    <div className="mt-4">
      <div className="text-sm md:text-md grid grid-cols-2 items-start justify-items-center md:gap-x-4">
        <div>
          <div className="grid gap-1 items-center mb-4">
            <p className="font-bold text-neutral-300">True Course {`(\xB0)`}</p>
            <input
              onChange={(e) => setTc(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
          </div>

          <div className="grid gap-1 items-center mb-4">
            <p className="font-bold text-neutral-300">True Airspeed</p>
            <input
              onChange={(e) => setTas(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
          </div>

          <div className="grid gap-1 items-center mb-4">
            <p className="font-bold text-neutral-300">
              Wind Direction {`(\xB0)`}
            </p>
            <input
              onChange={(e) => setWd(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
          </div>

          <div className="grid gap-1 items-center mb-4">
            <p className="font-bold text-neutral-300">Wind Speed</p>
            <input
              onChange={(e) => setWs(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
          </div>
        </div>
        <div>
          <div className="grid gap-1 items-center mb-4">
            <p className="font-bold text-neutral-300">Distance</p>
            <input
              onChange={(e) => setDis(+e.target.value)}
              placeholder="For ETE Calc"
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
          </div>
          <div className="grid gap-1 items-center mb-4">
            <p className="font-bold text-neutral-300">Fuel (gal/h)</p>
            <input
              onChange={(e) => setFlow(+e.target.value)}
              placeholder="For Fuel Calc"
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
          </div>
        </div>
      </div>
      <div className="grid items-center justify-items-center">
        <button
          className="bg-green-500 w-18 h-6 pl-2 pr-2 grid items-center justify-items-center rounded-md text-neutral-900 font-semibold mb-4"
          onClick={() => HandleClick(tc, wd, ws, tas)}
        >
          Calculate
        </button>

        <div className="flex gap-2 text-md md:text-lg">
          <p className="font-bold text-blue-300">WCA:</p>
          <p className="font-bold text-orange-300">
            {wca ? Math.round(wca) + "\xB0" : "--"}
          </p>
          <p className="font-bold text-blue-300">Heading:</p>
          <p className="font-bold text-orange-300">
            {heading ? Math.round(heading) + "\xB0" : "--"}
          </p>
          <p className="font-bold text-blue-300">GS:</p>
          <p className="font-bold text-orange-300">
            {gs ? Math.round(gs) : "--"}
          </p>
          <p className="font-bold text-blue-300">ETE:</p>
          <p className="font-bold text-orange-300">
            {ete ? ete.split(",")[0] : "--"}
          </p>
          <p className="font-bold text-blue-300">Fuel:</p>
          <p className="font-bold text-orange-300">
            {fuel ? Math.round(fuel) + "gal" : "--"}
          </p>
        </div>
      </div>
    </div>
  );
}
