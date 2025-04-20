"use client";

import { useState, useEffect } from "react";
import AirportData from "../api/airportList";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
  const HandleSearch = async (text) => {
    setOptions([{ icao: "Searching...", name: "" }]);
    try {
      setOptions(await AirportData(text));
    } catch {
      setOptions([]);
    }
  };

  const [value, setValue] = useState("");
  const [dep, setDep] = useState("");
  const [arr, setArr] = useState("");
  const [depValue, setDepValue] = useState("");
  const [arrValue, setArrValue] = useState("");
  const [options, setOptions] = useState([]);
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [dropDownClose, setDropdownClose] = useState(true);
  const [searchType, setSearchType] = useState("airport");

  function HandleRoute(text) {
    const params = new URLSearchParams(searchParams);
    text ? params.set("route", text) : params.delete("route");
    params.delete("airportCode");
    replace(`/?${params.toString()}`);
  }

  function HandleAirport(text) {
    const params = new URLSearchParams(searchParams);
    text ? params.set("airportCode", text) : params.delete("airportCode");
    params.delete("route");
    replace(`/?${params.toString()}`);
  }

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setDropdownClose(true);
    });
  }, []);

  const debounce = useDebouncedCallback(HandleSearch, 200);

  if (searchType === "airport") {
    return (
      <div className="text-slate-800 skew-x-[30deg] w-full h-full ml-2 md:ml-0">
        <input
          onClick={() => {
            setDropdownClose(false);
          }}
          onChange={async (e) => {
            setDropdownClose(false);
            setValue(e.target.value);
            e.target.value.length > 2
              ? debounce(e.target.value)
              : setOptions([]);
          }}
          value={value}
          className=" w-full h-full rounded-md grid justify-items-center px-2 items-center font-semibold bg-slate-300"
          placeholder="Search Airport"
          type="text"
        />
        <div
          className={
            dropDownClose === true
              ? "hidden"
              : "grid w-full h-4/5 mt-2 rounded-lg"
          }
        >
          <div
            onClick={() => {
              setSearchType("route");
              setDropdownClose(true);
              setValue("");
            }}
            className="relative items-center w-full text-md font-semibold bg-blue-400 hover:cursor-pointer text-center hover:bg-blue-800 hover:text-slate-300 border-b-2 border-slate-500 border-solid"
          >
            {"Search Route"}
          </div>
          {options.map((opt, i) => {
            return (
              <div
                key={i}
                onClick={async () => {
                  if (opt.icao_code === "Searching...") return;
                  setDropdownClose(true);
                  HandleAirport(opt.icao);
                  setValue(opt.icao);
                }}
                className="relative items-center w-full text-md font-semibold bg-slate-200 hover:cursor-pointer text-center hover:bg-blue-800 hover:text-slate-300 border-b-2 border-slate-500 border-solid"
              >{`${
                opt.icao === "Searching..." ? "Searching..." : `(${opt.icao})`
              } ${opt.name}`}</div>
            );
          })}
        </div>
      </div>
    );
  } else if (searchType === "route") {
    return (
      <div className="grid justify-items-center skew-x-[30deg] left-6 h-4/5 w-full text-slate-800">
        <form className="flex gap-2">
          <div className="text-slate-800 w-full h-full">
            <input
              onClick={() => setDropdownClose(false)}
              onChange={async (e) => {
                setDropdownClose(false);
                if (e.target.value === "Searching...") return;
                setDepValue(e.target.value);
                setArrValue("");
                e.target.value.length > 2
                  ? debounce(e.target.value)
                  : setOptions([]);
              }}
              className="w-full h-full rounded-md grid justify-items-center px-2 items-center font-semibold bg-slate-300"
              placeholder="Departure"
              type="text"
            />
          </div>
          <div className="text-slate-800 w-full h-full">
            <input
              onClick={() => setDropdownClose(false)}
              onChange={async (e) => {
                setDropdownClose(false);
                if (e.target.value === "Searching...") return;
                setDepValue("");
                setArrValue(e.target.value);
                e.target.value.length > 2
                  ? debounce(e.target.value)
                  : setOptions([]);
              }}
              className="w-full h-full rounded-md grid justify-items-center px-2 items-center font-semibold bg-slate-300"
              placeholder="Arrival"
              type="text"
            />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!dep || !arr) {
                alert("Enter both departure & arrival airport");
                return;
              }
              HandleRoute(`${dep},${arr}`);
            }}
            className="rounded-lg grid items-center justify-items-center text-slate-300 w-16 h-6"
          >
            Go
          </button>
        </form>
        <div
          className={
            dropDownClose === true
              ? "hidden"
              : "grid w-full h-4/5 mt-2 rounded-lg"
          }
        >
          <div
            onClick={() => {
              setSearchType("airport");
              setDropdownClose(true);
              setValue("");
            }}
            className={
              dropDownClose === true
                ? "hidden"
                : "relative items-center w-full text-md font-semibold bg-blue-400 hover:cursor-pointer text-center hover:bg-blue-800 hover:text-slate-300 border-b-2 border-slate-500 border-solid mt-2"
            }
          >
            {"Single Single Airport"}
          </div>

          {options.map((opt, i) => {
            return (
              <div
                key={i}
                onClick={async () => {
                  if (opt.icao === "Searching...") return;
                  setDropdownClose(true);

                  depValue.length !== 0 ? setDep(opt.icao) : setArr(opt.icao);
                }}
                className="relative items-center w-full text-md font-semibold bg-slate-200 hover:cursor-pointer text-center hover:bg-blue-800 hover:text-slate-300 border-b-2 border-slate-500 border-solid text-slate-800"
              >{`${
                opt.icao === "Searching..." ? "Searching..." : `(${opt.icao})`
              } ${opt.name}`}</div>
            );
          })}
        </div>
      </div>
    );
  }
}
