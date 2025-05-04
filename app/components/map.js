"use client";

import "../globals.css";
import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilerweather from "@maptiler/weather";
import { DateTime } from "luxon";

export default function Map({
  airport,
  asig,
  obs,
  arrObs,
  arrAirport,
  depBounding,
  arrBounding,
  depMsa,
  arrMsa,
}) {
  const [area, setArea] = useState("off");
  const [radar, setRadar] = useState("off");
  const [alt, setAlt] = useState("off");
  const [asOpen, setAsOpen] = useState("off");
  const [msaOpen, setMsaOpen] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const center = { lng: -114, lat: 33 };
  const markers = useRef([]);
  const asLayers = useRef([]);
  const asMarkers = useRef([]);
  const zoom = 1.2;
  maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAP_TOKEN;

  function AddRoute(mapInstance, coords) {
    if (mapInstance.current.getLayer("route")) {
      mapInstance.current.removeLayer("route");
    }
    if (mapInstance.current.getSource("route")) {
      mapInstance.current.removeSource("route");
    }
    mapInstance.current.addSource("route", {
      type: "geojson",
      lineMetrics: true,
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              coordinates: coords,
              type: "LineString",
            },
          },
        ],
      },
    });

    mapInstance.current.addLayer({
      type: "line",
      source: "route",
      id: "route",
      paint: {
        "line-color": "green",
        "line-width": 6,
      },
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
    });
  }
  function AddBox(mapInstance, coords, type) {
    if (type === "dep") {
      if (mapInstance.current.getLayer("box")) {
        mapInstance.current.removeLayer("box");
      }
      if (mapInstance.current.getSource("box")) {
        mapInstance.current.removeSource("box");
      }
    } else {
      if (mapInstance.current.getLayer("box2")) {
        mapInstance.current.removeLayer("box2");
      }
      if (mapInstance.current.getSource("box2")) {
        mapInstance.current.removeSource("box2");
      }
    }

    if (area === "off") return;

    let newCoords = [];

    coords.forEach((pair) => {
      let extract = [];
      extract.push(pair.longitude);
      extract.push(pair.latitude);
      newCoords.push(extract);
    });
    newCoords = [
      [
        [newCoords[0][0], newCoords[0][1]], // SW
        [newCoords[1][0], newCoords[0][1]], // SE
        [newCoords[1][0], newCoords[1][1]], // NE
        [newCoords[0][0], newCoords[1][1]], // NW
        [newCoords[0][0], newCoords[0][1]], // back to SW
      ],
    ];

    type === "dep"
      ? mapInstance.current.addSource("box", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: newCoords,
            },
          },
        })
      : mapInstance.current.addSource("box2", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: newCoords,
            },
          },
        });
    type === "dep"
      ? mapInstance.current.addLayer({
          id: "box",
          type: "fill",
          source: "box", // reference the data source
          layout: {},
          paint: {
            "fill-color": "#0080ff", // blue color fill
            "fill-opacity": 0.4,
          },
        })
      : mapInstance.current.addLayer({
          id: "box2",
          type: "fill",
          source: "box2", // reference the data source
          layout: {},
          paint: {
            "fill-color": "#0080ff", // blue color fill
            "fill-opacity": 0.4,
          },
        });
  }

  useEffect(() => {
    if (map.current) return;
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.HYBRID,
      center: [center.lng, center.lat],
      zoom: zoom,
      pitchWithRotate: true,
      navigationControl: false,
      terrainControl: true,
      terrainExaggeration: 2,
    });
  }, [center.lng, center.lat, zoom]);

  useEffect(() => {
    asMarkers.current.forEach((marker) => {
      marker.remove();
    });
    asMarkers.current = [];
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
    depBounding.length > 0 ? AddBox(map, depBounding, "dep") : "";
    arrBounding.length > 0 ? AddBox(map, arrBounding, "arr") : "";
  }, [depBounding, arrBounding, area]);

  useEffect(() => {
    if (!airport) return;
    markers.current.forEach((mark) => {
      mark.remove();
    });
    markers.current = [];
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

    let marker2;
    if (arrAirport) {
      const pin = document.createElement("div");
      pin.className = "marker";
      const popup2 = new maptilersdk.Popup({
        closeButton: false,
        closeOnMove: false,
      }).setHTML(`<div>${arrAirport.name}</div>`);

      marker2 = new maptilersdk.Marker({ element: pin })
        .setLngLat([arrAirport.lon, arrAirport.lat])
        .setPopup(popup2)
        .addTo(map.current);
    }
    markers.current = marker2
      ? [...markers.current, marker1, marker2]
      : [...markers.current, marker1];

    const obstaclesList =
      arrObs.length !== 0 ? [...obs, ...arrObs[0]] : [...obs];

    obstaclesList.forEach((obstacle) => {
      const popup = new maptilersdk.Popup({
        closeButton: false,
        closeOnMove: false,
      }).setHTML(
        `<div>${obstacle.name} | ${Math.round(
          obstacle.height ? obstacle.height * 3.28 : obstacle.elev * 3.28
        )}ft</div>`
      );

      const pin = document.createElement("div");
      if (
        obstacle.height >= 100 ||
        (!obstacle.height && obstacle.elev >= 100)
      ) {
        pin.className = "red-marker";
      } else if (
        (obstacle.height < 100 && obstacle.height >= 30) ||
        (!obstacle.height && obstacle.elev < 100 && obstacle.elev >= 30)
      ) {
        pin.className = "yellow-marker";
      } else if (
        obstacle.height < 30 ||
        (!obstacle.height && obstacle.elev < 30)
      ) {
        pin.className = "green-marker";
      }

      const marker1 = new maptilersdk.Marker({ element: pin })
        .setLngLat([obstacle.lon, obstacle.lat])
        .setPopup(popup)
        .addTo(map.current);
      markers.current = [...markers.current, marker1];
    });

    map.current.flyTo({
      center: [airport.lon, airport.lat],
      zoom: 10.5,
      pitch: 40,
    });
  }, [airport, arrAirport]);

  useEffect(() => {
    if (map.current.getLayer("route")) {
      map.current.removeLayer("route");
    }
    if (map.current.getSource("route")) {
      map.current.removeSource("route");
    }
    if (!airport || !arrAirport) return;

    AddRoute(map, [
      [airport.lon, airport.lat],
      [arrAirport.lon, arrAirport.lat],
    ]);
  }, [airport, arrAirport]);

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
    <div className="grid items-center justify-items-center mt-2">
      <div className="flex gap-4 w-[95%] md:w-[70%] justify-content-center mt-4 font-semibold">
        <select
          onChange={(e) => setAlt(e.target.value)}
          className="bg-zinc-300 text-zinc-800 rounded-lg w-[25%] h-[25px]"
        >
          <option value={"off"}>Wind</option>
          <option value={"sfc"}>SFC (Global)</option>
        </select>
        <select
          onChange={(e) => setAsOpen(e.target.value)}
          className="bg-zinc-300 text-zinc-800 rounded-lg w-[25%] h-[25px]"
        >
          <option value={"off"}>Air/Sig</option>
          <option value={"TANGO"}>Tango (US)</option>
          <option value={"SIERRA"}>Sierra (US)</option>
          <option value={"ZULU"}>Zulu (US)</option>
          <option value={"sig"}>Sigmet (US)</option>
        </select>
        <select
          onChange={(e) => setRadar(e.target.value)}
          className="bg-zinc-300 text-zinc-800 rounded-lg w-[25%] h-[25px]"
        >
          <option value={"off"}>Radar</option>
          <option value={"on"}>Radar On</option>
        </select>
        <select
          onChange={(e) => setArea(e.target.value)}
          className="bg-zinc-300 text-zinc-800 rounded-lg w-[25%] h-[25px]"
        >
          <option value={"off"}>25nm Area</option>
          <option value={"on"}>25nm On</option>
        </select>
      </div>
      <div className="relative">
        <div
          ref={mapContainer}
          className="rounded-lg w-[96vw] md:w-[65vw] h-[36vh] mt-2"
        />
        <div className="grid absolute top-4 left-1 gap-2">
          {airport ? (
            <div className="grid items-center bg-zinc-800 justify-items-start text-slate-300 font-semibold text-sm rounded-lg p-2 w-[130px]">
              <div className="flex gap-1 items-center">
                <div className="red-marker"></div>
                <p>{">300ft AGL"}</p>
              </div>
              <div className="flex gap-1 items-center">
                <div className="yellow-marker"></div>
                <p>{"100-300ft AGL"}</p>
              </div>
              <div className="flex gap-1 items-center">
                <div className="green-marker"></div>
                <p>{"<100ft AGL"}</p>
              </div>
            </div>
          ) : (
            <></>
          )}
          {depMsa && msaOpen ? (
            <div className="relative font-semibold bg-zinc-800 rounded-lg h-[150px] p-2 flex gap-6 items-center justify-center z-[50]">
              <div
                onClick={() => setMsaOpen(false)}
                className="text-sm absolute top-1 left-[40%] w-[50px] h-6 bg-yellow-400 text-zinc-800 grid items-center justify-items-center rounded-xl"
              >
                Hide
              </div>
              <div className="grid justify-items-center gap-2">
                <div className="circle">
                  <div className="line">
                    <p className="text-sm text-zinc-300 -mt-6 font-bold">
                      {"0\xB0"}
                    </p>
                  </div>
                  <div className="line">
                    {" "}
                    <p className="text-sm text-zinc-300 -mt-6 -ml-2 font-bold">
                      {"120\xB0"}
                    </p>
                  </div>
                  <div className="line">
                    {" "}
                    <p className="text-sm text-zinc-300 font-bold -mt-6 -ml-2">
                      {"240\xB0"}
                    </p>
                  </div>

                  <p className="font-bold text-zinc-300 absolute top-4 right-1 rotate-[45deg] text-sm">
                    {Math.round(depMsa ? depMsa[0] : 0)}
                  </p>
                  <p className="font-bold text-zinc-300 absolute bottom-2 left-6 text-sm">
                    {Math.round(depMsa ? depMsa[1] : 0)}
                  </p>
                  <p className="font-bold text-zinc-300 absolute top-4 left-1 -rotate-[45deg] text-sm">
                    {Math.round(depMsa ? depMsa[2] : 0)}
                  </p>
                </div>
                <p className="text-blue-300 font-bold text-sm">25nm Dep MSA</p>
              </div>
              <div className="grid justify-items-center gap-2">
                <div className="circle">
                  <div className="line">
                    <p className="text-sm text-zinc-300 -mt-6 font-bold">
                      {"0\xB0"}
                    </p>
                  </div>
                  <div className="line">
                    {" "}
                    <p className="text-sm text-zinc-300 -mt-6 -ml-2 font-bold">
                      {"120\xB0"}
                    </p>
                  </div>
                  <div className="line">
                    {" "}
                    <p className="text-sm text-zinc-300 font-bold -mt-6 -ml-2">
                      {"240\xB0"}
                    </p>
                  </div>

                  <p className="font-bold text-zinc-300 absolute top-4 right-1 rotate-[45deg] text-sm">
                    {Math.round(arrMsa ? arrMsa[0] : 0)}
                  </p>
                  <p className="font-bold text-zinc-300 absolute bottom-2 left-6 text-sm">
                    {Math.round(arrMsa ? arrMsa[1] : 0)}
                  </p>
                  <p className="font-bold text-zinc-300 absolute top-4 left-1 -rotate-[45deg] text-sm">
                    {Math.round(arrMsa ? arrMsa[2] : 0)}
                  </p>
                </div>
                <p className="text-blue-300 font-bold text-sm">25nm Arr MSA</p>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setMsaOpen(true)}
              className="text-sm font-semibold w-[60px] h-6 bg-orange-400 text-zinc-800 grid items-center justify-items-center rounded-xl"
            >
              MSA
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
