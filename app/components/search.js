"use client";

import { useState, useEffect } from "react";
import AirportData from "../api/airportList";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
  const [text, setText] = useState("");
  const [dropDownClose, setDropdownClose] = useState(true);
  const [options, setOptions] = useState([]);
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setDropdownClose(true);
    });
  }, []);

  function HandleClick(text) {
    const params = new URLSearchParams(searchParams);
    text ? params.set("airportCode", text) : params.delete("airportCode");

    replace(`/?${params.toString()}`);
  }

  const handleSearch = async (text) => {
    setOptions([{ icao: "Searching...", name: "" }]);
    try {
      setOptions(await AirportData(text));
    } catch {
      setOptions([]);
    }
  };

  const debounce = useDebouncedCallback(handleSearch, 200);

  return (
    <div className="z-10 relative w-full h-full ml-2 md:ml- skew-x-[30deg]">
      <input
        className="w-full h-full rounded grid justify-items-center px-2 items-center font-semibold bg-zinc-300"
        placeholder="Search Airport"
        onClick={() => {
          setDropdownClose(false);
        }}
        onChange={async (e) => {
          if (e.target.value === "Searching...") return;
          setText(e.target.value);
          e.target.value.length > 2 ? debounce(e.target.value) : setOptions([]);
        }}
        value={text}
      ></input>
      <div
        className={
          dropDownClose === true || options.length === 0
            ? "hidden"
            : "grid w-full h-4/5 mt-2 rounded-lg"
        }
      >
        {options.map((opt) => {
          return (
            <div
              key={opt.icao}
              onClick={async () => {
                if (opt.icao === "Searching...") return;
                setDropdownClose(true);
                HandleClick(opt.icao);
                setText(opt.icao);
                if (sessionStorage.getItem(`${opt.icao}-runways`))
                  sessionStorage.removeItem(`${opt.icao}-runways`);
                sessionStorage.setItem(
                  `${opt.icao}-runways`,
                  JSON.stringify(opt.runways)
                );
              }}
              className="grid items-center w-full text-md font-semibold bg-zinc-200 hover:cursor-pointer text-center hover:bg-blue-800 hover:text-zinc-300 border-b-2 border-zinc-500 border-solid"
            >{`${
              opt.icao === "Searching..." ? "Searching..." : `${opt.icao}`
            } ${opt.name}`}</div>
          );
        })}
      </div>
    </div>
  );
}
