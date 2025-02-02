"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "../globals.css";

export default function WorldView({ airports }) {
  const map = useRef();
  const mapContainerRef = useRef();
  const markers = useRef([]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZGFuaWVseWFuZzc4NyIsImEiOiJjbHBsZnJlcWswMzJwMnFtcngxbmhncW9sIn0.vfAYQ-0Jt3SUOWOV9vLmsw";
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: `mapbox://styles/mapbox/dark-v9`,
      zoom: 1.05,
      center: [-180, 34],
    });

    return () => {
      map.current.remove();
    };
  }, []);

  useEffect(() => {
    markers.current.forEach((mark) => {
      mark.remove();
    });
    markers.current = [];
  }, [airports]);

  useEffect(() => {
    airports.forEach((airp) => {
      const popup = new mapboxgl.Popup({
        offset: [10, 0],
        closeButton: false,
        closeOnMove: false,
        closeOnClick: false,
      }).setHTML(
        `<div className="mapboxgl-popup-content mapbox-popup-tip">${airp.name} | ${airp.temp}\xB0${airp.units}</div>`
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

      const marker1 = new mapboxgl.Marker(pin)
        .setLngLat([airp.lon, airp.lat])
        .setPopup(popup)
        .addTo(map.current)
        .togglePopup();
      markers.current = [...markers.current, marker1];
    });
  }, [airports]);

  return <div id="map-container" ref={mapContainerRef} />;
}
