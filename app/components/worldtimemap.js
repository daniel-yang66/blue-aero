"use client";

import "../globals.css";
import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilerweather from "@maptiler/weather";
import { DateTime } from "luxon";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Map({ airports, wind, text, asig, status }) {
  const [radar, setRadar] = useState("off");
  const [alt, setAlt] = useState("off");
  const [asOpen, setAsOpen] = useState("off");
  const mapContainer = useRef(null);
  const map = useRef(null);
  const center = { lng: -114, lat: 33 };
  const markers = useRef([]);
  const windMarkers = useRef([]);
  const asLayers = useRef([]);
  const asMarkers = useRef([]);
  const [openText, setOpenText] = useState(false);
  const zoom = 1.2;
  maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAP_TOKEN;

  const { replace } = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  function HandleClick() {
    const params = new URLSearchParams(searchParams);
    params.set("status", status === "1" ? "6" : "1");
    replace(`${pathName}?${params.toString()}`);
  }

  useEffect(() => {}, [status]);

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.DATAVIZ.DARK,
      center: [center.lng, center.lat],
      zoom: zoom,
    });
  }, [center.lng, center.lat, zoom]);

  useEffect(() => {
    markers.current.forEach((mark) => {
      mark.remove();
    });
    markers.current = [];
  }, [airports]);

  useEffect(() => {
    windMarkers.current.forEach((marker) => {
      marker.remove();
    });
    windMarkers.current = [];

    wind.forEach((item) => {
      const pin = document.createElement("div");
      pin.className = "arrow-wind";
      const pinNoWind = document.createElement("div");
      pinNoWind.className = "no-wind";
      if (
        alt !== "off" &&
        item[alt - (9 - (item.length - 3))] &&
        alt - (9 - (item.length - 3)) > 0
      ) {
        let windDir, windVel;
        if (
          +item[alt - (9 - (item.length - 3))][0] > 3 &&
          +item[alt - (9 - (item.length - 3))].slice(0, 2) !== 99
        ) {
          windDir = +item[alt - (9 - (item.length - 3))].slice(0, 2) - 50;
          windVel = 100 + +item[alt - (9 - (item.length - 3))].slice(2, 4);
        } else if (+item[alt - (9 - (item.length - 3))].slice(2, 4) === 0) {
          windDir = 0;
          windVel = 0;
        } else {
          windDir = +item[alt - (9 - (item.length - 3))].slice(0, 2);
          windVel = +item[alt - (9 - (item.length - 3))].slice(2, 4);
        }
        const popup = new maptilersdk.Popup({
          closeButton: false,
          closeOnMove: false,
        }).setHTML(`<div>${windDir * 10}\xB0 | ${windVel}kt</div>`);
        const marker1 =
          windDir !== 0
            ? new maptilersdk.Marker({ element: pin })
                .setLngLat([item[item.length - 1], item[item.length - 2]])
                .setRotation(windDir * 10 + 90)
                .addTo(map.current)
                .setPopup(popup)
            : new maptilersdk.Marker({ element: pinNoWind })
                .setLngLat([item[item.length - 1], item[item.length - 2]])
                .setRotation(windDir * 10 + 90)
                .addTo(map.current)
                .setPopup(popup);
        windMarkers.current = [...windMarkers.current, marker1];
      }
    });
  }, [wind, alt, status]);

  useEffect(() => {
    asMarkers.current.forEach((marker) => {
      marker.remove();
    });
    if (asLayers.current.length > 0) {
      asLayers.current.forEach((layer) => {
        if (map.current.getLayer(layer)) map.current.removeLayer(layer);

        if (map.current.getSource(layer)) map.current.removeSource(layer);
      });
    }
    if (!map.current || asOpen === "off") return;

    const filtered =
      asOpen !== "sig"
        ? asig[0].filter((item) => {
            return item.product === asOpen;
          })
        : asig[1];

    asOpen !== "sig"
      ? filtered.forEach((item, i) => {
          let coordsParsed = [];
          let color;
          if (item.product === "TANGO") {
            color = "yellow";
          } else if (item.product === "SIERRA") {
            color = "red";
          }
          if (item.product === "ZULU") {
            color = "lightblue";
          }
          item.coords.forEach((coord) => {
            let arr = [];
            arr.push(coord.lon);
            arr.push(coord.lat);
            coordsParsed.push(arr);
          });
          map.current.addSource(`as${i}`, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Polygon",
                    coordinates: [coordsParsed],
                  },
                },
              ],
            },
          });

          map.current.addLayer({
            id: `as${i}`,
            type: "fill",
            source: `as${i}`,
            layout: {},
            paint: {
              "fill-color": color,
              "fill-opacity": 0.6,
            },
          });

          const pin = document.createElement("div");
          pin.className = "asig";

          const popup = new maptilersdk.Popup({
            closeButton: false,
            closeOnMove: false,
          }).setHTML(
            `<div><p>${item.hazard} (${
              item.base ? item.base.toLocaleString() : "N/A"
            } - ${item.top ? item.top.toLocaleString() : "N/A ft"})</p>
        <p>From  ${
          DateTime.fromSeconds(item.issueTime, { zone: "UTC" }).hour
        }:${String(
              DateTime.fromSeconds(item.issueTime, { zone: "UTC" }).minute
            ).padStart(2, "0")}Z to ${
              DateTime.fromSeconds(item.expireTime, { zone: "UTC" }).hour
            }:${String(
              DateTime.fromSeconds(item.expireTime, { zone: "UTC" }).minute
            ).padStart(2, "0")}Z</p>
        </div>`
          );

          const asmarker = new maptilersdk.Marker({ element: pin })
            .setLngLat(coordsParsed[0])
            .setPopup(popup)
            .addTo(map.current);

          asLayers.current.push(`as${i}`);
          asMarkers.current.push(asmarker);
        })
      : filtered.forEach((item, i) => {
          let coordsParsed = [];
          if (item.severity === 0) return;

          item.coords.forEach((coord) => {
            let arr = [];
            arr.push(coord.lon);
            arr.push(coord.lat);
            coordsParsed.push(arr);
          });
          map.current.addSource(`as${i}`, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Polygon",
                    coordinates: [coordsParsed],
                  },
                },
              ],
            },
          });

          map.current.addLayer({
            id: `as${i}`,
            type: "fill",
            source: `as${i}`,
            layout: {},
            paint: {
              "fill-color": "pink",
              "fill-opacity": 0.6,
            },
          });

          const pin = document.createElement("div");
          pin.className = "asig";

          const popup = new maptilersdk.Popup({
            closeButton: false,
            closeOnMove: false,
          }).setHTML(
            `<div><p>${item.hazard} (${
              item.altitudeLow1 ? item.altitudeLow1.toLocaleString() : "N/A"
            } - ${
              item.altitudeHi2 ? item.altitudeHi2.toLocaleString() : "N/A ft"
            })
        </p><p> From  ${
          DateTime.fromSeconds(item.validTimeFrom, { zone: "UTC" }).hour
        }:${String(
              DateTime.fromSeconds(item.validTimeFrom, { zone: "UTC" }).minute
            ).padStart(2, "0")}Z to ${
              DateTime.fromSeconds(item.validTimeTo, { zone: "UTC" }).hour
            }:${String(
              DateTime.fromSeconds(item.validTimeTo, { zone: "UTC" }).minute
            ).padStart(2, "0")}Z</p>
        </div>`
          );

          const asmarker = new maptilersdk.Marker({ element: pin })
            .setLngLat(coordsParsed[0])
            .setPopup(popup)
            .addTo(map.current);

          asLayers.current.push(`as${i}`);
          asMarkers.current.push(asmarker);
        });
  }, [asig, asOpen]);

  useEffect(() => {
    airports.forEach((airp) => {
      const popup = new maptilersdk.Popup({
        closeButton: false,
        closeOnMove: false,
      }).setHTML(`<div>${airp.name} | ${airp.temp}\xB0${airp.units}</div>`);

      const pin = document.createElement("div");
      if (airp.rules === "VFR") {
        pin.className = "green-marker";
      }
      if (airp.rules === "MVFR") {
        pin.className = "blue-marker";
      }
      if (airp.rules === "IFR") {
        pin.className = "red-marker";
      }
      if (airp.rules === "LIFR") {
        pin.className = "purple-marker";
      }

      const marker1 = new maptilersdk.Marker({ element: pin })
        .setLngLat([airp.lon, airp.lat])
        .setPopup(popup)
        .addTo(map.current);
      markers.current = [...markers.current, marker1];
    });
  }, [airports]);

  useEffect(() => {
    let radarLayer;

    if (radar === "on") {
      if (map.current.getLayer("radar")) {
        map.current.setLayoutProperty("radar", "visibility", "visible");
      } else {
        radarLayer = new maptilerweather.RadarLayer({ id: "radar" });
        map.current.addLayer(radarLayer);
      }
    } else {
      if (!map.current.getLayer("radar")) return;
      map.current.setLayoutProperty("radar", "visibility", "none");
    }
  }, [radar]);

  useEffect(() => {
    let windLayer;

    if (alt === "sfc") {
      if (map.current.getLayer("wind")) {
        map.current.setLayoutProperty("wind", "visibility", "visible");
      } else {
        windLayer = new maptilerweather.WindLayer({ id: "wind" });
        map.current.setPaintProperty(
          "Water",
          "fill-color",
          "rgba(0, 0, 0, 0.4)"
        );
        map.current.addLayer(windLayer, "Water");
      }
    } else {
      if (!map.current.getLayer("wind")) return;
      map.current.setLayoutProperty("wind", "visibility", "none");
    }
  }, [alt]);

  return (
    <div className="grid items-center justify-items-center">
      {openText ? (
        <div className="z-10 w-[90vw] md:w-[70vw] h-[45vh] left-[5vw] md:left-[15vw] overflow-auto absolute grid items-center justify-items-center text-yellow-400 bg-neutral-700 text-sm md:text-md">
          <p
            onClick={() => setOpenText(false)}
            className="text-red-500 text-lg absolute top-2 right-2 font-bold"
          >
            X
          </p>
          <div className="grid gap-4 overflow-auto h-[90%] w-[85%]">
            {text.map((line, i) => {
              let newLine = [];
              let num;
              line.split(" ").forEach((str) => {
                if (str.length === 0) {
                  num += 1;
                } else return;
              });
              if (line.slice(0, 2) !== "FT") {
                line.split(" ").forEach((str, i) => {
                  if (str.length === 0 && i < num + 1) {
                    newLine.push(str);
                  } else {
                    newLine.push(str + " ");
                  }
                });
              } else {
                line.split(" ").forEach((str) => {
                  newLine.push(str + " ");
                });
              }
              return (
                <p style={{ whiteSpace: "pre-wrap" }} key={i}>
                  {newLine.join(" ")}
                </p>
              );
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex gap-[10%] absolute top-[13%] left-[5%] md:left-[15%] w-[90%] md:w-[70%] justify-content-center">
        <button
          className="bg-blue-400 w-[33%] h-[25px] grid items-center p-x-2 text-neutral-900 rounded-lg"
          onClick={() => {
            HandleClick();
            setOpenText(true);
          }}
        >
          W&T Raw
        </button>

        <select
          onChange={(e) => setAlt(e.target.value)}
          className="bg-neutral-300 text-neutral-800 rounded-lg w-[33%] h-[25px]"
        >
          <option value={"off"}>Wind</option>
          <option value={"sfc"}>SFC (Global)</option>
          <option value={1}>FL30 (Cont. US)</option>
          <option value={2}>FL60 (Cont. US)</option>
          <option value={3}>FL90 (Cont. US)</option>
          <option value={4}>FL120 (Cont. US)</option>
          <option value={5}>FL180 (Cont. US)</option>
          <option value={6}>FL240 (Cont. US)</option>
          <option value={7}>FL300 (Cont. US)</option>
          <option value={8}>FL340 (Cont. US)</option>
          <option value={9}>FL390 (Cont. US)</option>
        </select>
        <select
          onChange={(e) => setAsOpen(e.target.value)}
          className="bg-neutral-300 text-neutral-800 rounded-lg w-[33%] h-[25px]"
        >
          <option value={"off"}>Air/Sig</option>
          <option value={"TANGO"}>Tango (US)</option>
          <option value={"SIERRA"}>Sierra (US)</option>
          <option value={"ZULU"}>Zulu (US)</option>
          <option value={"sig"}>Sigmet (US)</option>
        </select>
        <select
          onChange={(e) => setRadar(e.target.value)}
          className="bg-neutral-300 text-neutral-800 rounded-lg w-[33%] h-[25px]"
        >
          <option value={"off"}>Radar</option>
          <option value={"on"}>Radar On</option>
        </select>
      </div>
      <div
        ref={mapContainer}
        className="rounded-lg mt-[8vh] w-[90vw] md:w-[80vw] h-[36vh]"
      />
    </div>
  );
}
