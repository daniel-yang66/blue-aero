"use client";
import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilerweather from "@maptiler/weather";
import clsx from "clsx";
import "../globals.css";

export default function Map({ open, onSetOpen, coords, code }) {
  const [wind, setWind] = useState("off");
  const [radar, setRadar] = useState("off");
  const [marker, setMarker] = useState();

  const mapContainer = useRef(null);
  const map = useRef(null);
  const center = { lng: -114, lat: 33 };
  const zoom = 1.2;
  maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAP_TOKEN;

  useEffect(() => {
    if (map.current || !open) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.DATAVIZ,
      center: [center.lng, center.lat],
      zoom: zoom,
    });
  }, [center.lng, center.lat, zoom, open]);

  useEffect(() => {
    if (coords.length === 0 || !open) return;

    if (marker) {
      marker.remove();
      setMarker(null);
    }
    const el = document.createElement("div");
    el.className = "marker";

    const popup = new maptilersdk.Popup({
      offset: 20,
      className: "popup",
      closeButton: false,
    }).setText(code);

    const mark = new maptilersdk.Marker({ element: el })
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(map.current);
    mark.togglePopup();

    setMarker(mark);
  }, [coords, open]);

  useEffect(() => {
    if (!map.current) return;
    let windLayer,
      radarLayer = false;
    if (wind === "on") {
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
    if (wind === "off") {
      if (!map.current.getLayer("wind")) return;

      map.current.setLayoutProperty("wind", "visibility", "none");
    }
  }, [radar, wind]);

  return (
    <div
      className={clsx(
        "fixed z-20 left-[5vw] md:left-[10vw] top-[8vh] w-[90vw] md:w-[80vw] h-[80vh] grid items-center justify-items-center bg-neutral-700 rounded-lg",
        {
          grid: open,
          hidden: !open,
        }
      )}
    >
      <p
        onClick={() => onSetOpen(false)}
        className="absolute top-1 right-2 text-red-500 text-xl font-bold hover:cursor-pointer"
      >
        X
      </p>
      <p className="absolute top-2 left-4 font-semibold text-lg text-neutral-300">
        Global Wind & Radar
      </p>
      <div className="flex gap-[10%] absolute top-[10%] left-[15%] md:left-[30%] w-[70%] md:w-[40%] justify-content-center">
        <select
          onChange={(e) => setWind(e.target.value)}
          className="bg-neutral-300 text-neutral-800 rounded-lg w-[45%] h-[25px]"
        >
          <option value={"off"}>Wind Off</option>
          <option value={"on"}>Wind On</option>
        </select>
        <select
          onChange={(e) => setRadar(e.target.value)}
          className="bg-neutral-300 text-neutral-800 rounded-lg w-[45%] h-[25px]"
        >
          <option value={"off"}>Radar Off</option>
          <option value={"on"}>Radar On</option>
        </select>
      </div>
      <div ref={mapContainer} className="w-[90%] h-[80%] rounded-lg mt-[8vh]" />
    </div>
  );
}
