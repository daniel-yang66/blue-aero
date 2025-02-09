"use client";

import "../globals.css";
import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilerweather from "@maptiler/weather";

export default function Map({ airports, wind, text }) {
  const [radar, setRadar] = useState("off");
  const [alt, setAlt] = useState("off");

  const mapContainer = useRef(null);
  const map = useRef(null);
  const center = { lng: -114, lat: 33 };
  const markers = useRef([]);
  const windMarkers = useRef([]);
  const [openText, setOpenText] = useState(false);
  const zoom = 1.2;
  maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAP_TOKEN;

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
        let windDir;
        if (+item[alt - (9 - (item.length - 3))].slice(2, 4) > 100) {
          windDir = +item[alt - (9 - (item.length - 3))].slice(0, 2) - 50;
        } else if (+item[alt - (9 - (item.length - 3))].slice(0, 2) === 99) {
          windDir = 0;
        } else {
          windDir = +item[alt - (9 - (item.length - 3))].slice(0, 2);
        }
        const marker1 =
          windDir !== 0
            ? new maptilersdk.Marker({ element: pin })
                .setLngLat([item[item.length - 1], item[item.length - 2]])
                .setRotation(windDir * 10 + 90)
                .addTo(map.current)
            : new maptilersdk.Marker({ element: pinNoWind });
        windMarkers.current = [...windMarkers.current, marker1];
      }
    });
  }, [wind, alt]);

  useEffect(() => {
    airports.forEach((airp) => {
      const popup = new maptilersdk.Popup({
        closeButton: false,
        closeOnMove: false,
      }).setHTML(
        `<div className="popup-content">${airp.name} | ${airp.temp}\xB0${airp.units}</div>`
      );

      const pin = document.createElement("div");
      if (airp.rules === "VFR") {
        pin.className = "green-marker";
      }
      if (airp.rules === "MVFR") {
        pin.className = "yellow-marker";
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
    if (!map.current) return;
    let windLayer, radarLayer;
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
    }
    if (radar === "on") {
      if (map.current.getLayer("radar")) {
        map.current.setLayoutProperty("radar", "visibility", "visible");
      } else {
        radarLayer = new maptilerweather.RadarLayer({ id: "radar" });
        map.current.setPaintProperty(
          "Water",
          "fill-color",
          "rgba(0, 0, 0, 0.4)"
        );
        map.current.addLayer(radarLayer);
      }
    }
    if (radar === "off") {
      if (!map.current.getLayer("radar")) return;
      map.current.setLayoutProperty("radar", "visibility", "none");
    }
    if (alt === "off") {
      if (!map.current.getLayer("wind")) return;

      map.current.setLayoutProperty("wind", "visibility", "none");
    }
  }, [radar, alt]);

  return (
    <div className="grid items-center justify-items-center">
      {openText ? (
        <div className="z-10 w-[90vw] md:w-[60vw] h-[40vh] overflow-auto absolute grid items-center justify-items-center text-yellow-400 bg-neutral-700 text-sm md:text-md">
          <p
            onClick={() => setOpenText(false)}
            className="text-red-500 text-lg absolute top-2 right-2 font-bold"
          >
            X
          </p>
          <div className="grid gap-4 overflow-auto h-[80%] w-[98%] md:w-[80%]">
            {text.map((line, i) => {
              return (
                <p style={{ whiteSpace: "pre-wrap" }} key={i}>
                  {line}
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
          onClick={() => setOpenText(true)}
        >
          Wind Report
        </button>

        <select
          onChange={(e) => setAlt(e.target.value)}
          className="bg-neutral-300 text-neutral-800 rounded-lg w-[33%] h-[25px]"
        >
          <option value={"off"}>Wind Off</option>
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
          onChange={(e) => setRadar(e.target.value)}
          className="bg-neutral-300 text-neutral-800 rounded-lg w-[33%] h-[25px]"
        >
          <option value={"off"}>Radar Off</option>
          <option value={"on"}>Radar On</option>
        </select>
      </div>
      <div
        ref={mapContainer}
        className="rounded-lg mt-[8vh] w-[90vw] md:w-[80vw] h-[30vh]"
      />
    </div>
  );
}
