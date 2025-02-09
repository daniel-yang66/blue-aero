"use client";

import { useEffect, useState } from "react";

export default function Zulu() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [time, setTime] = useState("--:-- | --/-- (---)");
  const getZulu = function () {
    setTime(
      `${String(new Date().getUTCHours()).padStart(2, "0")}:${String(
        new Date().getUTCMinutes()
      ).padStart(2, "0")} | ${String(new Date().getUTCMonth() + 1)}/${String(
        new Date().getUTCDate()
      )} (${days[new Date().getUTCDay()]})`
    );
  };
  useEffect(() => {
    const interval = setInterval(() => getZulu());
    return () => clearInterval(interval);
  }, []);
  return <p className="text-md font-semibold text-neutral-300">GMT: {time}</p>;
}
