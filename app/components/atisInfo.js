"use client";
import { useEffect, useState, useRef } from "react";
import Atis from "../api/atis";
import clsx from "clsx";
import LoadingForecast from "./loadingForecast";
export default function AtisInfo({ airport, onSetOpen, open }) {
  const [atis, setAtis] = useState(null);
  const [loading, setLoading] = useState(false);
  const counter = useRef(0);

  async function getAtis() {
    try {
      setLoading(true);
      counter.current = 0;
      let atisInfo = await Atis(airport);
      if (atisInfo.length > 1) {
        let atisList = [];
        atisInfo.forEach((item) => {
          atisList.push(item.datis.split("."));
        });
        setAtis(atisList);
      } else {
        setAtis([atisInfo[0].datis.split(".")]);
      }
      counter.current += 1;
      setLoading(false);
    } catch {
      alert("Failed to fetch ATIS");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!airport || counter.current >= 1 || !open) return;
    getAtis(airport);
  }, [airport, open]);

  if (loading === true) {
    return <LoadingForecast />;
  } else if (atis) {
    return (
      <div
        className={clsx(
          "grid justify-items-center fixed w-[90vw] top-[9.5vh] md:w-[60vw] h-[77vh] left-[5vw] md:left-[20vw] bg-neutral-700 z-10 rounded-lg p-4 gap-2 font-semibold",
          {
            grid: open,
            hidden: !open,
          }
        )}
      >
        <div
          onClick={() => onSetOpen(false)}
          className="text-red-500 text-lg font-bold absolute top-1 right-2 hover:cursor-pointer"
        >
          X
        </div>
        <div className="overflow-auto grid gap-2">
          <div>
            {atis ? (
              atis.map((chunk, i) => {
                return (
                  <div key={i} className="mb-2 grid">
                    {chunk.map((sentence, i) => {
                      return (
                        <p
                          key={i}
                          className={`${
                            i === 0 ? "text-green-400" : `text-blue-300`
                          } font-semibold text-sm`}
                        >
                          {sentence}
                        </p>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={clsx(
          "grid justify-items-center fixed w-[90vw] top-[9.5vh] md:w-[60vw] h-[77vh] left-[5vw] md:left-[20vw] bg-neutral-700 z-10 rounded-lg p-4 gap-2 font-semibold",
          {
            grid: open,
            hidden: !open,
          }
        )}
      >
        <div
          onClick={() => onSetOpen(false)}
          className="text-red-500 text-lg font-bold absolute top-1 right-2 hover:cursor-pointer"
        >
          X
        </div>
        ATIS Unavailable
      </div>
    );
  }
}
