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
  const [bag2, setBag2] = useState(0);
  const [bagArm, setBagArm] = useState(0);
  const [bagArm2, setBagArm2] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [fuel2, setFuel2] = useState(0);
  const [fuelArm, setFuelArm] = useState(0);
  const [fuelArm2, setFuelArm2] = useState(0);
  const [other, setOther] = useState(0);
  const [other2, setOther2] = useState(0);
  const [otherArm, setOtherArm] = useState(0);
  const [otherArm2, setOtherArm2] = useState(0);
  const [start, setStart] = useState(0);
  const [startArm, setStartArm] = useState(0);
  const [burn, setBurn] = useState(0);
  const [burnArm, setBurnArm] = useState(0);

  return (
    <div
      className={clsx(
        "items-center gap-4 justify-items-center h-[70vh] overflow-auto",
        {
          grid: status,
          hidden: !status,
        }
      )}
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
            bag2 >= 0 &&
            bagArm >= 0 &&
            bagArm2 >= 0 &&
            fuel >= 0 &&
            fuel2 >= 0 &&
            fuelArm >= 0 &&
            fuelArm2 >= 0 &&
            other >= 0 &&
            other2 >= 0 &&
            otherArm >= 0 &&
            otherArm2 >= 0 &&
            start >= 0 &&
            startArm >= 0 &&
            burn >= 0 &&
            burnArm >= 0,
          grid:
            emptyWt < 0 ||
            emptyWtArm < 0 ||
            front < 0 ||
            frontArm < 0 ||
            rear < 0 ||
            rearArm < 0 ||
            bag < 0 ||
            bag2 < 0 ||
            bagArm2 < 0 ||
            bagArm < 0 ||
            fuel < 0 ||
            fuel2 < 0 ||
            fuelArm2 < 0 ||
            fuelArm < 0 ||
            other < 0 ||
            other2 < 0 ||
            otherArm < 0 ||
            otherArm2 < 0 ||
            start < 0 ||
            startArm < 0 ||
            burn < 0 ||
            burnArm < 0,
        })}
      >
        No negative numbers!
      </p>
      <div className="flex gap-4 items-end">
        <div className="grid gap-4 items-center justify-items-end">
          <p className="font-semibold text-blue-400">Empty Wt</p>
          <p className="font-semibold text-zinc-300">+Front seats</p>
          <p className="font-semibold text-zinc-300">+Rear seats</p>
          <p className="font-semibold text-zinc-300">+Bag area 1</p>
          <p className="font-semibold text-zinc-300">+Bag area 2</p>
          <p className="font-semibold text-zinc-300">+Other 1</p>
          <p className="font-semibold text-zinc-300">+Other 2</p>

          <p className="font-semibold text-blue-400">ZFW</p>
          <p className="font-semibold text-zinc-300">+Fuel 1</p>
          <p className="font-semibold text-zinc-300">+Fuel 2</p>
          <p className="font-semibold text-blue-400">Ramp Wt</p>
          <p className="font-semibold text-zinc-300">-Taxi</p>
          <p className="font-semibold text-blue-400">TOW</p>
          <p className="font-semibold text-zinc-300">-Fuel Burn</p>
          <p className="font-semibold text-blue-400">Landing Wt</p>
        </div>
        <div className="grid gap-4">
          <div className="flex gap-4">
            <div className="grid gap-2 items-center">
              <p className="font-bold text-orange-300 text-md md:text-lg">
                Wt (lb)
              </p>
              <input
                            inputMode="numeric"

                onChange={(e) => {
                  if (+e.target.value || e.target.value === "0") {
                    setEmptywt(+e.target.value);
                  }
                  if (e.target.value.length === 0) {
                    setEmptywt(0);
                  }
                }}
                className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
              />
            </div>
            <div className="grid gap-2 items-center">
              <p className="font-bold text-orange-300 text-md md:text-lg">
                Arm (in)
              </p>
              <input
                inputMode="numeric"
                onChange={(e) => {
                  if (+e.target.value || e.target.value === "0") {
                    setEmptyWtArm(+e.target.value);
                  }
                  if (e.target.value.length === 0) {
                    setEmptyWtArm(0);
                  }
                }}
                className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
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
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0") {
                  setFront(+e.target.value);
                }
                if (e.target.value.length === 0) {
                  setFront(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0") {
                  setFrontArm(+e.target.value);
                }
                if (e.target.value.length === 0) {
                  setFrontArm(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(front * frontArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setRear(+e.target.value);
                if (e.target.value.length === 0) {
                  setRear(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setRearArm(+e.target.value);
                if (e.target.value.length === 0) {
                  setRearArm(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(rear * rearArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setBag(+e.target.value);
                if (e.target.value.length === 0) {
                  setBag(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setBagArm(+e.target.value);
                if (e.target.value.length === 0) {
                  setBagArm(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(bag * bagArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setBag2(+e.target.value);
                if (e.target.value.length === 0) {
                  setBag2(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setBagArm2(+e.target.value);
                if (e.target.value.length === 0) {
                  setBagArm2(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(bag2 * bagArm2)}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setOther(+e.target.value);
                if (e.target.value.length === 0) {
                  setOther(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setOtherArm(+e.target.value);
                if (e.target.value.length === 0) {
                  setOtherArm(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(other * otherArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setOther2(+e.target.value);
                if (e.target.value.length === 0) {
                  setOther2(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setOtherArm2(+e.target.value);
                if (e.target.value.length === 0) {
                  setOtherArm2(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(other2 * otherArm2)}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {Math.round(emptyWt + front + rear + bag + bag2 + other + other2)}
            </p>
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {Math.round(emptyWt + front + rear + bag + bag2 + other + other2)
                ? (
                    Math.round(
                      bag * bagArm +
                        bag2 * bagArm2 +
                        other * otherArm +
                        other2 * otherArm2 +
                        rear * rearArm +
                        front * frontArm +
                        emptyWt * emptyWtArm
                    ) /
                    Math.round(
                      emptyWt + front + rear + bag + bag2 + other + other2
                    )
                  ).toFixed(2)
                : ""}
            </p>
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(
                bag * bagArm +
                  bag2 * bagArm2 +
                  other * otherArm +
                  other2 * otherArm2 +
                  rear * rearArm +
                  front * frontArm +
                  emptyWt * emptyWtArm
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setFuel(+e.target.value);
                if (e.target.value.length === 0) {
                  setFuel(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setFuelArm(+e.target.value);
                if (e.target.value.length === 0) {
                  setFuelArm(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(fuel * fuelArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setFuel2(+e.target.value);
                if (e.target.value.length === 0) {
                  setFuel2(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setFuelArm2(+e.target.value);
                if (e.target.value.length === 0) {
                  setFuelArm2(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(fuel2 * fuelArm2)}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {Math.round(
                emptyWt +
                  front +
                  rear +
                  bag +
                  bag2 +
                  other +
                  other2 +
                  fuel +
                  fuel2
              )}
            </p>
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {Math.round(
                emptyWt +
                  front +
                  rear +
                  bag +
                  bag2 +
                  other +
                  other2 +
                  fuel +
                  fuel2
              )
                ? (
                    Math.round(
                      bag * bagArm +
                        bag2 * bagArm2 +
                        other * otherArm +
                        other2 * otherArm2 +
                        rear * rearArm +
                        front * frontArm +
                        emptyWt * emptyWtArm +
                        fuel * fuelArm +
                        fuel2 * fuelArm2
                    ) /
                    Math.round(
                      emptyWt +
                        front +
                        rear +
                        bag +
                        bag2 +
                        other +
                        other2 +
                        fuel +
                        fuel2
                    )
                  ).toFixed(2)
                : ""}
            </p>
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(
                Math.round(
                  bag * bagArm +
                    bag2 * bagArm2 +
                    other * otherArm +
                    other2 * otherArm2 +
                    rear * rearArm +
                    front * frontArm +
                    emptyWt * emptyWtArm +
                    fuel * fuelArm +
                    fuel2 * fuelArm2
                )
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0") {
                  setStart(+e.target.value);
                }
                if (e.target.value.length === 0) {
                  setStart(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setStartArm(+e.target.value);
                if (e.target.value.length === 0) {
                  setStartArm(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(start * startArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {Math.round(
                emptyWt +
                  front +
                  rear +
                  bag +
                  bag2 +
                  other +
                  other2 +
                  fuel +
                  fuel2 -
                  start
              )}
            </p>
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {emptyWt +
              front +
              rear +
              bag +
              bag2 +
              other +
              other2 +
              fuel +
              fuel2 -
              start
                ? (
                    Math.round(
                      bag * bagArm +
                        bag2 * bagArm2 +
                        other * otherArm +
                        other2 * otherArm2 +
                        rear * rearArm +
                        front * frontArm +
                        emptyWt * emptyWtArm +
                        fuel * fuelArm +
                        fuel2 * fuelArm2 -
                        start * startArm
                    ) /
                    Math.round(
                      emptyWt +
                        front +
                        rear +
                        bag +
                        bag2 +
                        other +
                        other2 +
                        fuel +
                        fuel2 -
                        start
                    )
                  ).toFixed(2)
                : ""}
            </p>
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(
                Math.round(
                  bag * bagArm +
                    bag2 * bagArm2 +
                    other * otherArm +
                    other2 * otherArm2 +
                    rear * rearArm +
                    front * frontArm +
                    emptyWt * emptyWtArm +
                    fuel * fuelArm +
                    fuel2 * fuelArm2 -
                    start * startArm
                )
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setBurn(+e.target.value);
                if (e.target.value.length === 0) {
                  setBurn(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <input
              inputMode="numeric"
              onChange={(e) => {
                if (+e.target.value || e.target.value === "0")
                  setBurnArm(+e.target.value);
                if (e.target.value.length === 0) {
                  setBurnArm(0);
                }
              }}
              className="p-2 w-[20vw] h-6 rounded-lg bg-zinc-300 font-semibold text-zinc-900"
            />
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(burn * burnArm)}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {Math.round(
                emptyWt +
                  front +
                  rear +
                  bag +
                  bag2 +
                  other +
                  other2 +
                  fuel +
                  fuel2 -
                  start -
                  burn
              )}
            </p>
            <p className="w-[20vw] h-6 font-semibold text-green-400">
              {Math.round(
                emptyWt +
                  front +
                  rear +
                  bag +
                  bag2 +
                  other +
                  other2 +
                  fuel +
                  fuel2 -
                  start -
                  burn
              )
                ? (
                    Math.round(
                      bag * bagArm +
                        bag2 * bagArm2 +
                        other * otherArm +
                        other2 * otherArm2 +
                        rear * rearArm +
                        front * frontArm +
                        emptyWt * emptyWtArm +
                        fuel * fuelArm +
                        fuel2 * fuelArm2 -
                        start * startArm -
                        burn * burnArm
                    ) /
                    Math.round(
                      emptyWt +
                        front +
                        rear +
                        bag +
                        bag2 +
                        other +
                        other2 +
                        fuel +
                        fuel2 -
                        start -
                        burn
                    )
                  ).toFixed(2)
                : ""}
            </p>
            <p className="w-[15vw] h-6 font-semibold text-green-400">
              {Math.round(
                Math.round(
                  bag * bagArm +
                    bag2 * bagArm2 +
                    other * otherArm +
                    other2 * otherArm2 +
                    rear * rearArm +
                    front * frontArm +
                    emptyWt * emptyWtArm +
                    fuel * fuelArm +
                    fuel2 * fuelArm2 -
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
