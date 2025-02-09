"use client";
import clsx from "clsx";
export default function Clouds({ weather, onSetOpen, open }) {
  const cloudData = weather
    ? weather["clouds"].sort((a, b) => b.altitude - a.altitude)
    : [];

  return (
    <div
      className={clsx(
        "justify-items-center fixed w-[90vw] top-[9.5vh] md:w-[60vw] h-[30vh] left-[5vw] md:left-[20vw] bg-neutral-700 z-10 rounded-lg p-4 font-semibold overflow-auto",
        {
          grid: open,
          hidden: !open,
        }
      )}
    >
      <div
        onClick={() => onSetOpen(false)}
        className="text-red-500 text-lg font-bold absolute top-1 right-2 hover:cursor-pointer"
      >
        X
      </div>
      {cloudData.map((layer, i) => {
        let cloudImg;
        if (layer["type"] === "FEW") {
          cloudImg = (
            <div className="flex gap-8 items-center justify-content-center">
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
            </div>
          );
        }
        if (layer["type"] === "SCT") {
          cloudImg = (
            <div className="flex gap-6 items-center justify-content-center">
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
            </div>
          );
        }
        if (layer["type"] === "BKN") {
          cloudImg = (
            <div className="flex gap-2 items-center justify-content-center">
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
            </div>
          );
        }
        if (layer["type"] === "OVC" || layer["type"] === "VV") {
          cloudImg = (
            <div className="flex items-center justify-content-center">
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
              <img src="cbase.png" width={25} height={25} alt="cloud" />
            </div>
          );
        }
        return (
          <div
            key={i}
            className="flex gap-4 items-center text-sm md:text-md text-neutral-300"
          >
            <p>
              {layer["type"]} -{" "}
              {(layer["altitude"] * 100).toLocaleString() + "ft"}
            </p>
            {cloudImg}
          </div>
        );
      })}
    </div>
  );
}
