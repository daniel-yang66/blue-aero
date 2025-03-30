"use client";

import "../globals.css";
import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilerweather from "@maptiler/weather";
import { DateTime } from "luxon";

export default function Map({ airport, asig, obs, obsWideRadius }) {
  const [radar, setRadar] = useState("off");
  const [alt, setAlt] = useState("off");
  const [asOpen, setAsOpen] = useState("off");
  const [style, setStyle] = useState("DATAVIZ.DARK");
  const [msa, setMsa] = useState("--");
  const mapContainer = useRef(null);
  const map = useRef(null);
  const center = { lng: -114, lat: 33 };
  const markers = useRef([]);
  const asLayers = useRef([]);
  const asMarkers = useRef([]);
  const zoom = 1.2;
  maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAP_TOKEN;

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.DATAVIZ.DARK,
      center: [center.lng, center.lat],
      zoom: zoom,
      navigationControl: false,
    });
  }, [center.lng, center.lat, zoom]);

  useEffect(() => {
    let newStyle;
    newStyle = style.split(".");
    newStyle.length === 2
      ? map.current.setStyle(maptilersdk.MapStyle[newStyle[0]][newStyle[1]])
      : map.current.setStyle(maptilersdk.MapStyle[newStyle[0]]);
  }, [style]);

  useEffect(() => {
    markers.current.forEach((mark) => {
      mark.remove();
    });
    markers.current = [];
  }, [airport]);

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
    if (!airport) return;
    const popup = new maptilersdk.Popup({
      closeButton: false,
      closeOnMove: false,
    }).setHTML(`<div>${airport.name}</div>`);

    const pin = document.createElement("div");
    pin.className = "marker";

    const marker1 = new maptilersdk.Marker({ element: pin })
      .setLngLat([airport.lon, airport.lat])
      .setPopup(popup)
      .addTo(map.current);
    markers.current = [...markers.current, marker1];

    let maxHeight = 0;
    obsWideRadius.forEach((obstacle) => {
      if (obstacle.height > maxHeight) {
        maxHeight = obstacle.height;
      }
    });
    setMsa(maxHeight + 300);

    obs.forEach((obstacle) => {
      const popup = new maptilersdk.Popup({
        closeButton: false,
        closeOnMove: false,
      }).setHTML(`<div>${obstacle.name} | ${obstacle.height}m</div>`);

      const pin = document.createElement("div");
      if (obstacle.height >= 60) {
        pin.className = "red-marker";
      } else if (obstacle.height < 60 && obstacle.height >= 30) {
        pin.className = "yellow-marker";
      } else {
        pin.className = "green-marker";
      }

      const marker1 = new maptilersdk.Marker({ element: pin })
        .setLngLat([obstacle.lon, obstacle.lat])
        .setPopup(popup)
        .addTo(map.current);
      markers.current = [...markers.current, marker1];
    });
    map.current.flyTo({ center: [airport.lon, airport.lat], zoom: 12 });
  }, [airport, obs]);

  useEffect(() => {
    if (!map.current) return;
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
    if (!map.current) return;
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
      <div className="flex gap-[10%] w-[90%] md:w-[70%] justify-content-center mt-4">
        <select
          onChange={(e) => setAlt(e.target.value)}
          className="bg-neutral-300 text-neutral-800 rounded-lg w-[25%] h-[25px]"
        >
          <option value={"off"}>Wind</option>
          <option value={"sfc"}>SFC (Global)</option>
        </select>
        <select
          onChange={(e) => setAsOpen(e.target.value)}
          className="bg-neutral-300 text-neutral-800 rounded-lg w-[25%] h-[25px]"
        >
          <option value={"off"}>Air/Sig</option>
          <option value={"TANGO"}>Tango (US)</option>
          <option value={"SIERRA"}>Sierra (US)</option>
          <option value={"ZULU"}>Zulu (US)</option>
          <option value={"sig"}>Sigmet (US)</option>
        </select>
        <select
          onChange={(e) => setRadar(e.target.value)}
          className="bg-neutral-300 text-neutral-800 rounded-lg w-[25%] h-[25px]"
        >
          <option value={"off"}>Radar</option>
          <option value={"on"}>Radar On</option>
        </select>
      </div>
      <div className="relative">
        <div
          ref={mapContainer}
          className="rounded-lg w-[96vw] md:w-[65vw] h-[36vh] mt-2"
        />
        <div className="grid absolute top-4 left-1 gap-2 ">
          <div className="flex gap-2">
            <select
              onChange={(e) => setStyle(e.target.value)}
              className="text-sm text-neutral-800 font-semibold w-24 h-6 bg-neutral-300 rounded-lg grid items-center justify-items-center"
            >
              <option value="DATAVIZ.DARK">DARK</option>
              <option value="DATAVIZ">LIGHT</option>
              <option value="SATELLITE">SATELLITE</option>
              <option value="HYBRID">HYBRID</option>
            </select>
            <p className="text-blue-300 font-semibold text-sm">MSA: {msa}m</p>
          </div>
          {airport ? (
            <div className="grid items-center justify-items-start text-slate-300 font-semibold text-sm">
              <div className="flex gap-1 items-center">
                <div className="red-marker"></div>
                <p>{">60m AGL"}</p>
              </div>
              <div className="flex gap-1 items-center">
                <div className="yellow-marker"></div>
                <p>{"30-60m AGL"}</p>
              </div>
              <div className="flex gap-1 items-center">
                <div className="green-marker"></div>
                <p>{"<30m AGL"}</p>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
