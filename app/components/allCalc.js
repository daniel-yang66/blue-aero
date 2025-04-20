"use client";

import { useState } from "react";
import FlightNav from "./flightnav";
import WB from "./wb";
import clsx from "clsx";

export default function AllCalc() {
  const [wbShow, setWBShow] = useState(false);
  const [navShow, setNavShow] = useState(true);

  return (
    <div className="grid justify-items-center">
      <div className="flex gap-2 items-center justify-content-center mt-4 mb-4">
        <button
          className={clsx(
            "w-20 h-6 rounded-xl grid items-center p-x-2 font-bold",
            {
              "bg-blue-800 text-zinc-300": navShow,
              "bg-blue-400 text-zinc-900": !navShow,
            }
          )}
          onClick={() => {
            setNavShow(true);
            setWBShow(false);
          }}
        >
          Nav
        </button>
        <button
          className={clsx(
            "w-20 h-6 rounded-xl grid items-center p-x-2 font-bold",
            {
              "bg-blue-800 text-zinc-300": wbShow,
              "bg-blue-400 text-zinc-900": !wbShow,
            }
          )}
          onClick={() => {
            setNavShow(false);
            setWBShow(true);
          }}
        >
          W/B
        </button>
      </div>
      <WB status={wbShow} />
      <FlightNav status={navShow} />
    </div>
  );
}
