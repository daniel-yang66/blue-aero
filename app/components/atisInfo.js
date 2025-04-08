"use client";
import { useEffect, useState } from "react";
import Atis from "../api/atis";
import Loading from "./loading";
export default function AtisInfo({ airport }) {
  const [atis, setAtis] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getAtis() {
    setLoading(true);
    try {
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
      setLoading(false);
    } catch {
      alert("Failed to fetch ATIS");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!airport) return;
    getAtis(airport);
  }, [airport]);

  if (loading === true) {
    return <Loading />;
  } else if (atis) {
    return (
      <div className="w-[96vw] md:w-[65vw] h-[90%] bg-neutral-800 p-2 relative rounded-lg grid z-[5]">
        <div className="flex items-center gap-2 mb-[5px] text-neutral-300">
          <img src="/icon.png" width={25} height={25} alt="plane" />
          <h1 className="grid font-bold text-sm md:text-lg">
            {airport ? `${airport} ATIS` : "----"}
          </h1>
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
      <div className="w-[96vw] md:w-[65vw] h-[90%] bg-neutral-800 p-2 relative rounded-lg grid justify-items-center z-[5] overflow-auto text-neutral-300">
        ATIS Unavailable
      </div>
    );
  }
}
