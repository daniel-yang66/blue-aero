"use client";

import clsx from "clsx";
import { useState } from "react";

export default function WB({ status }) {
  const [emptyWt, setEmptywt] = useState(0);
  const [emptyWtArm, setEmptyWtArm] = useState(0);
  const [front, setFront] = useState(0);
  const [frontArm, setFrontArm] = useState(0);
  const [rear, setRear] = useState(0);
  const [rearArm, setRearArm] = useState(0);
  const [bag, setBag] = useState(0);
  const [bagArm, setBagArm] = useState(0);
  const [zfwArm, setZfwArm] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [fuelArm, setFuelArm] = useState(0);
  const [rampArm, setRampArm] = useState(0);
  const [start, setStart] = useState(0);
  const [startArm, setStartArm] = useState(0);
  const [towArm, setTowArm] = useState(0);
  const [burn, setBurn] = useState(0);
  const [burnArm, setBurnArm] = useState(0);
  const [ldwArm, setLDWArm] = useState(0);

  return (
    <div
      className={clsx("items-center gap-4 justify-items-center", {
        grid: status,
        hidden: !status,
      })}
    >
      <p
        className={clsx("text-red-500 text-md md:text-lg font-semibold", {
          hidden:
            emptyWt >= 0 &&
            emptyWtArm >= 0 &&
            front >= 0 &&
            frontArm >= 0 &&
            rear >= 0 &&
            rearArm >= 0 &&
            bag >= 0 &&
            bagArm >= 0 &&
            zfwArm >= 0 &&
            fuel >= 0 &&
            fuelArm >= 0 &&
            rampArm >= 0 &&
            start >= 0 &&
            startArm >= 0 &&
            towArm >= 0 &&
            burn >= 0 &&
            burnArm >= 0 &&
            ldwArm >= 0,
          grid:
            emptyWt < 0 ||
            emptyWtArm < 0 ||
            front < 0 ||
            frontArm < 0 ||
            rear < 0 ||
            rearArm < 0 ||
            bag < 0 ||
            bagArm < 0 ||
            zfwArm < 0 ||
            fuel < 0 ||
            fuelArm < 0 ||
            rampArm < 0 ||
            start < 0 ||
            startArm < 0 ||
            towArm < 0 ||
            burn < 0 ||
            burnArm < 0 ||
            ldwArm < 0,
        })}
      >
        No negative numbers!
      </p>
      <div className="flex gap-4 items-end">
        <div className="grid gap-4 items-center justify-items-end">
          <p className="font-semibold text-blue-400">Empty Wt</p>
          <p className="font-semibold text-neutral-300">+Front seats</p>
          <p className="font-semibold text-neutral-300">+Rear seats</p>
          <p className="font-semibold text-neutral-300">+Baggage</p>
          <p className="font-semibold text-blue-400">ZFW</p>
          <p className="font-semibold text-neutral-300">+Fuel</p>
          <p className="font-semibold text-blue-400">Ramp Wt</p>
          <p className="font-semibold text-neutral-300">-Taxi</p>
          <p className="font-semibold text-blue-400">TOW</p>
          <p className="font-semibold text-neutral-300">-Fuel Burn</p>
          <p className="font-semibold text-blue-400">Landing Wt</p>
        </div>
        <div className="grid gap-4">
          <div className="flex gap-4">
            <div className="grid gap-2 items-center">
              <p className="font-bold text-orange-300 text-md md:text-lg">
                Wt (lb)
              </p>
              <input
                onChange={(e) => setEmptywt(+e.target.value)}
                className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
              />
            </div>
            <div className="grid gap-2 items-center">
              <p className="font-bold text-orange-300 text-md md:text-lg">
                Arm (in)
              </p>
              <input
                onChange={(e) => setEmptyWtArm(+e.target.value)}
                className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
              />
            </div>
            <div className="grid gap-2 items-center">
              <p className="font-bold text-orange-300 text-md md:text-lg">
                Moment
              </p>
              <p className="w-[15vw] h-6 font-semibold text-green-400">
                {Math.round(emptyWt * emptyWtArm)}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFront(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <input
              onChange={(e) => setFrontArm(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(front * frontArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              onChange={(e) => setRear(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <input
              onChange={(e) => setRearArm(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(rear * rearArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              onChange={(e) => setBag(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <input
              onChange={(e) => setBagArm(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(bag * bagArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {Math.round(emptyWt + front + rear + bag)}
            </p>
            <input
              onChange={(e) => setZfwArm(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(
                bag * bagArm +
                  rear * rearArm +
                  front * frontArm +
                  emptyWt * emptyWtArm
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFuel(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <input
              onChange={(e) => setFuelArm(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(fuel * fuelArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {Math.round(emptyWt + front + rear + bag + fuel)}
            </p>
            <input
              onChange={(e) => setRampArm(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(
                Math.round(
                  bag * bagArm +
                    rear * rearArm +
                    front * frontArm +
                    emptyWt * emptyWtArm +
                    fuel * fuelArm
                )
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              onChange={(e) => setStart(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <input
              onChange={(e) => setStartArm(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(start * startArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {Math.round(emptyWt + front + rear + bag + fuel - start)}
            </p>
            <input
              onChange={(e) => setTowArm(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(
                Math.round(
                  bag * bagArm +
                    rear * rearArm +
                    front * frontArm +
                    emptyWt * emptyWtArm +
                    fuel * fuelArm -
                    start * startArm
                )
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              onChange={(e) => setBurn(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <input
              onChange={(e) => setBurnArm(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(burn * burnArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {Math.round(emptyWt + front + rear + bag + fuel - start - burn)}
            </p>
            <input
              onChange={(e) => setLDWArm(+e.target.value)}
              className="p-2 w-[20vw] h-6 rounded-lg bg-neutral-300 font-semibold text-neutral-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(
                Math.round(
                  bag * bagArm +
                    rear * rearArm +
                    front * frontArm +
                    emptyWt * emptyWtArm +
                    fuel * fuelArm -
                    start * startArm -
                    burn * burnArm
                )
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
