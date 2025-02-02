"use client";

import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import clsx from "clsx";
import Stats from "./info";

export default function Details({ dep, arr, img, cty }) {
  const [type, setType] = useState("dep");
  const [filter, setFilter] = useState("All");
  const [depList, setDepList] = useState([]);
  const [arrList, setArrList] = useState([]);
  const [open, setOpen] = useState("close");
  const [zone, setZone] = useState("loc");
  const [flights, setFlights] = useState([]);

  useMemo(() => {
    let list = [];
    let data = type === "dep" ? dep : arr;

    data.forEach((flight) => {
      let depCode = "N/A";
      let arrCode = "N/A";
      let depCity = "N/A";
      let arrCity = "N/A";
      const time =
        type === "dep"
          ? flight.flight.time.scheduled.departure
          : flight.flight.time.scheduled.arrival;
      if (
        type === "dep" &&
        time > Date.now() / 1000 &&
        time <= Date.now() / 1000 + 6 * 3600
      ) {
        if (
          flight.flight.airport.destination &&
          flight.flight.airport.destination.code
        ) {
          arrCode = flight.flight.airport.destination.code.iata
            ? flight.flight.airport.destination.code.iata
            : flight.flight.airport.destination.code.icao;

          arrCity = flight.flight.airport.destination.position.region.city;
          list.push(`${arrCode} | ${arrCity}`);
        }
      } else if (
        type === "arr" &&
        time > Date.now() / 1000 &&
        time <= Date.now() / 1000 + 6 * 3600
      ) {
        if (flight.flight.airport.origin && flight.flight.airport.origin.code) {
          depCode = flight.flight.airport.origin.code.iata
            ? flight.flight.airport.origin.code.iata
            : flight.flight.airport.origin.code.icao;
          depCity = flight.flight.airport.origin.position.region.city;

          list.push(`${depCode} | ${depCity}`);
        }
      }
    });

    list = [
      "All",
      ...[...new Set(list)].sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }

        return 0;
      }),
    ];
    type === "dep" ? setDepList(list) : setArrList(list);
  }, [type, dep, arr]);

  useMemo(() => {
    let filtered = [];
    let newData = type === "dep" ? dep : arr;

    newData.forEach((flight) => {
      let depCode = "N/A";
      let arrCode = "N/A";
      const time =
        type === "dep"
          ? flight.flight.time.scheduled.departure
          : flight.flight.time.scheduled.arrival;
      if (type === "dep") {
        if (
          flight.flight.airport.destination &&
          flight.flight.airport.destination.code
        ) {
          arrCode = flight.flight.airport.destination.code.iata
            ? flight.flight.airport.destination.code.iata
            : flight.flight.airport.destination.code.icao;
        }
      } else {
        if (flight.flight.airport.origin && flight.flight.airport.origin.code) {
          depCode = flight.flight.airport.origin.code.iata
            ? flight.flight.airport.origin.code.iata
            : flight.flight.airport.origin.code.icao;
        }
      }
      if (
        filter !== "All" &&
        type === "dep" &&
        time > Date.now() / 1000 &&
        time <= Date.now() / 1000 + 6 * 3600 &&
        arrCode === filter
      ) {
        filtered.push(flight);
      } else if (
        filter !== "All" &&
        type === "arr" &&
        time > Date.now() / 1000 &&
        time <= Date.now() / 1000 + 6 * 3600 &&
        depCode === filter
      ) {
        filtered.push(flight);
      } else if (
        time > Date.now() / 1000 &&
        time <= Date.now() / 1000 + 6 * 3600 &&
        filter === "All"
      ) {
        filtered.push(flight);
      }
    });
    setFlights([...filtered]);
  }, [type, dep, arr, filter]);

  if (
    flights.length !== 0 &&
    (type === "dep"
      ? flights[0].flight.airport.destination.code
      : flights[0].flight.airport.origin.code)
  ) {
    return (
      <div className="grid items-center justify-items-center h-[84vh] overflow-auto p-4 gap-2 relative">
        <div className="flex gap-2">
          <select
            className="rounded-lg w-[110px] h-[25px] bg-neutral-300 text-neutral-800 font-semibold"
            onChange={(e) => {
              setType(e.target.value);
              setFilter("All");
            }}
          >
            <option value={"dep"}>Departures</option>
            <option value={"arr"}>Arrivals</option>
          </select>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            className="rounded-lg w-[110px] h-[25px] bg-neutral-300 text-neutral-800 font-semibold"
          >
            {type === "dep"
              ? depList.map((opt, i) => {
                  return (
                    <option
                      key={i}
                      value={
                        opt !== "All" ? opt.slice(0, opt.indexOf(" | ")) : "All"
                      }
                    >
                      {opt}
                    </option>
                  );
                })
              : arrList.map((opt, i) => {
                  return (
                    <option
                      key={i}
                      value={
                        opt !== "All" ? opt.slice(0, opt.indexOf(" | ")) : "All"
                      }
                    >
                      {opt}
                    </option>
                  );
                })}
          </select>
          <div
            onClick={() => {
              setZone(zone === "loc" ? "gmt" : "loc");
            }}
            className=" grid items-center justify-items-center rounded-lg w-[110px] h-[25px] bg-blue-300 text-neutral-800 font-semibold hover:cursor-pointer"
          >
            {zone === "loc" ? "To GMT" : "To Local"}
          </div>
        </div>
        <p
          onClick={() => {
            setOpen("open");
          }}
          className="text-lg text-blue-300 font-semibold hover:cursor-pointer"
        >
          View Stats
        </p>

        <div className="grid justify-items-center relative w-[98vw] md:w-[60vw] h-[70vh] bg-neutral-900 rounded-lg overflow-auto gap-4">
          {flights
            .sort((a, b) => {
              a =
                type === "dep"
                  ? a.flight.time.scheduled.departure
                  : a.flight.time.scheduled.arrival;
              b =
                type === "dep"
                  ? b.flight.time.scheduled.departure
                  : b.flight.time.scheduled.arrival;

              if (a < b) {
                return -1;
              }
              if (a > b) {
                return 1;
              }

              return 0;
            })
            .map((flight, i) => {
              let regis,
                copyright = "";
              let source = "placeholder";
              let air, tz, timeH, timeM, depTime, arrTime, status;
              if (type === "dep") {
                air = flight.flight.airport.destination
                  ? flight.flight.airport.destination.code.iata
                    ? `${flight.flight.airport.destination.code.iata} | ${flight.flight.airport.destination.position.region.city}`
                    : `${flight.flight.airport.destination.code.iata} | ${flight.flight.airport.destination.position.region.city}`
                  : "N/A";
                let offset =
                  flight.flight.airport.destination.timezone.offset % 3600 === 0
                    ? Math.round(
                        flight.flight.airport.destination.timezone.offset / 3600
                      )
                    : (
                        flight.flight.airport.destination.timezone.offset / 3600
                      ).toFixed(1);

                offset >= 0 ? (tz = `GMT +${offset}`) : (tz = `GMT ${offset}`);

                status =
                  flight.flight.time.estimated &&
                  flight.flight.time.estimated.departure
                    ? `(ETD ${String(
                        DateTime.fromSeconds(
                          flight.flight.time.estimated.departure,
                          {
                            zone:
                              zone === "loc"
                                ? flight.flight.airport.origin.timezone.name
                                : "UTC",
                          }
                        ).hour
                      ).padStart(2, "0")}:${String(
                        DateTime.fromSeconds(
                          flight.flight.time.estimated.departure,
                          {
                            zone:
                              zone === "loc"
                                ? flight.flight.airport.origin.timezone.name
                                : "UTC",
                          }
                        ).minute
                      ).padStart(2, "0")})`
                    : "";
              } else {
                air = flight.flight.airport.origin
                  ? flight.flight.airport.origin.code.iata
                    ? `${flight.flight.airport.origin.code.iata} | ${flight.flight.airport.origin.position.region.city}`
                    : `${flight.flight.airport.origin.code.icao} | ${flight.flight.airport.origin.position.region.city}`
                  : "N/A";

                let offset =
                  flight.flight.airport.origin.timezone.offset % 3600 === 0
                    ? Math.round(
                        flight.flight.airport.origin.timezone.offset / 3600
                      )
                    : (
                        flight.flight.airport.origin.timezone.offset / 3600
                      ).toFixed(1);

                offset >= 0 ? (tz = `GMT +${offset}`) : (tz = `GMT ${offset}`);

                status =
                  flight.flight.time.estimated &&
                  flight.flight.time.estimated.arrival
                    ? `(ETA ${String(
                        DateTime.fromSeconds(
                          flight.flight.time.estimated.arrival,
                          {
                            zone:
                              zone === "loc"
                                ? flight.flight.airport.destination.timezone
                                    .name
                                : "UTC",
                          }
                        ).hour
                      ).padStart(2, "0")}:${String(
                        DateTime.fromSeconds(
                          flight.flight.time.estimated.arrival,
                          {
                            zone:
                              zone === "loc"
                                ? flight.flight.airport.destination.timezone
                                    .name
                                : "UTC",
                          }
                        ).minute
                      ).padStart(2, "0")})`
                    : "";
              }
              if (
                flight.flight.time.scheduled &&
                flight.flight.time.scheduled.departure &&
                flight.flight.time.scheduled.arrival
              ) {
                timeH =
                  Math.floor(
                    (flight.flight.time.scheduled.arrival -
                      flight.flight.time.scheduled.departure) /
                      3600
                  ) !== 0
                    ? Math.floor(
                        (flight.flight.time.scheduled.arrival -
                          flight.flight.time.scheduled.departure) /
                          3600
                      ) + "h"
                    : "";

                timeM = Math.round(
                  (flight.flight.time.scheduled.arrival -
                    flight.flight.time.scheduled.departure) /
                    60 -
                    Math.floor(
                      (flight.flight.time.scheduled.arrival -
                        flight.flight.time.scheduled.departure) /
                        3600
                    ) *
                      60
                );

                depTime = `${String(
                  DateTime.fromSeconds(flight.flight.time.scheduled.departure, {
                    zone:
                      zone === "loc"
                        ? flight.flight.airport.origin.timezone.name
                        : "UTC",
                  }).hour
                ).padStart(2, "0")}:${String(
                  DateTime.fromSeconds(flight.flight.time.scheduled.departure, {
                    zone:
                      zone === "loc"
                        ? flight.flight.airport.origin.timezone.name
                        : "UTC",
                  }).minute
                ).padStart(2, "0")} ${String(
                  DateTime.fromSeconds(flight.flight.time.scheduled.departure, {
                    zone:
                      zone === "loc"
                        ? flight.flight.airport.origin.timezone.name
                        : "UTC",
                  }).weekdayShort
                )}`;
                arrTime = `${String(
                  DateTime.fromSeconds(flight.flight.time.scheduled.arrival, {
                    zone:
                      zone === "loc"
                        ? flight.flight.airport.destination.timezone.name
                        : "UTC",
                  }).hour
                ).padStart(2, "0")}:${String(
                  DateTime.fromSeconds(flight.flight.time.scheduled.arrival, {
                    zone:
                      zone === "loc"
                        ? flight.flight.airport.destination.timezone.name
                        : "UTC",
                  }).minute
                ).padStart(2, "0")} ${String(
                  DateTime.fromSeconds(flight.flight.time.scheduled.arrival, {
                    zone:
                      zone === "loc"
                        ? flight.flight.airport.destination.timezone.name
                        : "UTC",
                  }).weekdayShort
                )}`;
              }
              if (
                flight.flight.aircraft &&
                flight.flight.aircraft.registration &&
                flight.flight.aircraft.registration.length > 0
              ) {
                img.some((i) => {
                  if (i.reg === flight.flight.aircraft.registration) {
                    regis = i.reg;
                    source = i.src;
                    copyright = i.copy;
                    return true;
                  }
                });
              }
              return (
                <div
                  className="grid items-center justify-items-center relative text-neutral-300 h-[28vh] w-[97vw] md:w-[50vw] overflow-auto bg-neutral-800 rounded-lg p-2 font-semibold text-md"
                  key={i}
                >
                  <div className="absolute top-2 left-2 grid gap-1 items-center">
                    <div className="flex gap-2 items-center">
                      <p className="font-bold">
                        {flight.flight.airline
                          ? flight.flight.airline.short
                          : "Unknown"}
                      </p>
                      <p className="font-bold">
                        {flight.flight.identification.number
                          ? flight.flight.identification.number.default
                            ? `(${flight.flight.identification.number.default})`
                            : "(N/A)"
                          : "(N/A)"}
                      </p>
                    </div>
                    <p className="text-sm">
                      A/C:{" "}
                      {flight.flight.aircraft
                        ? flight.flight.aircraft.model.text
                          ? flight.flight.aircraft.model.text
                          : flight.flight.aircraft.model.code
                        : "N/A"}
                    </p>
                    <p className="text-sm">
                      Time: {timeH} {timeM}m
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 grid items-center justify-items-end gap-2">
                    <div
                      className={clsx(
                        "rounded-full w-[80px] h-[21px] text-neutral-800 font-semibold grid items-center justify-items-center text-sm",
                        {
                          "bg-green-500": flight.flight.status.icon === "green",
                          "bg-yellow-500":
                            flight.flight.status.icon === "yellow",
                          "bg-red-500": flight.flight.status.icon === "red",
                          "bg-neutral-300": !flight.flight.status.icon,
                        }
                      )}
                    >
                      {flight.flight.status.icon
                        ? flight.flight.status.icon === "yellow" ||
                          flight.flight.status.icon === "red"
                          ? "Delayed"
                          : "On Time"
                        : "Status N/A"}
                    </div>
                    {regis !== "" && source !== "placeholder" ? (
                      <div className="grid items-center">
                        <div
                          style={{
                            width: "105px",
                            height: "65px",
                            position: "relative",
                          }}
                        >
                          <img
                            width={105}
                            height={65}
                            loading="lazy"
                            className="rounded-lg"
                            src={String(source).length > 0 ? source : null}
                            alt="airplane image"
                          />
                        </div>
                        <p className=" h-[30px] text-xs text-neutral-300 overflow-auto w-[100px]">
                          &copy; {copyright}
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="grid gap-1 justify-items-center items-center text-neutral-300 font-bold">
                    <p className="text-sm md:text-md">{air}</p>
                    <p className="text-xs md:text-sm">({tz})</p>
                  </div>
                  <div className="absolute left-2 bottom-2 flex gap-6 items-center">
                    <div className="flex gap-2 items-end">
                      <img
                        src="/plane.png"
                        width={35}
                        height={35}
                        alt="departing plane"
                        className="-rotate-[24deg]"
                      />
                      <p>{depTime}</p>
                    </div>

                    <div className="flex gap-2 items-end">
                      <img
                        src="/plane.png"
                        width={35}
                        height={35}
                        alt="arriving plane"
                        className="rotate-[24deg]"
                      />
                      <p>{arrTime}</p>
                      <p className="text-sm md:text-md">{status}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <Stats
          dep={dep}
          arr={arr}
          cty={cty}
          status={open}
          onSetOpen={setOpen}
        />
      </div>
    );
  } else {
    return (
      <div className="grid justify-items-center h-[80vh] overflow-auto p-4 gap-4">
        <div className="flex gap-2">
          <select
            className="rounded-lg w-[120px] h-[30px] bg-neutral-300 text-neutral-800 font-semibold"
            onChange={(e) => {
              setType(e.target.value);
              setFilter("All");
            }}
          >
            <option value={"dep"}>Departures</option>
            <option value={"arr"}>Arrivals</option>
          </select>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            className="rounded-lg w-[120px] h-[30px] bg-neutral-300 text-neutral-800 font-semibold"
          >
            {type === "dep"
              ? depList.map((opt, i) => {
                  return (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  );
                })
              : arrList.map((opt, i) => {
                  return (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  );
                })}
          </select>
          <div
            onClick={() => {
              setZone(zone === "loc" ? "gmt" : "loc");
            }}
            className=" grid items-center justify-items-center rounded-lg w-[120px] h-[30px] bg-blue-500 text-neutral-800 font-semibold hover:cursor-pointer"
          >
            {zone === "loc" ? "Local Time" : "GMT"}
          </div>
        </div>
        <p className="text-neutral-300 text-lg font-semibold">
          No Flights Found.
        </p>
      </div>
    );
  }
}
