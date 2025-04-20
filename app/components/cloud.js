"use client";
import clsx from "clsx";
export default function Clouds({ weather, onSetOpen, open, type }) {
  const cloudData = weather
    ? weather["clouds"].sort((a, b) => b.altitude - a.altitude)
    : [];

  return (
    <div
      className={clsx(
        `w-[96vw] ${
          type === "route" ? "md:w-[45vw]" : "md:w-[65vw]"
        } h-full bg-zinc-800 p-2 absolute top-0 left-0 rounded-md grid items-center justify-items-center z-10 overflow-auto text-zinc-300 overflow-auto font-bold `,
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
      {cloudData.length !== 0 ? (
        cloudData.map((layer, i) => {
          let cloudImg;
          if (layer["type"] === "FEW") {
            cloudImg = (
              <div className="flex gap-8 items-center justify-content-center">
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
              </div>
            );
          }
          if (layer["type"] === "SCT") {
            cloudImg = (
              <div className="flex gap-6 items-center justify-content-center">
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
              </div>
            );
          }
          if (layer["type"] === "BKN") {
            cloudImg = (
              <div className="flex gap-2 items-center justify-content-center">
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
              </div>
            );
          }
          if (layer["type"] === "OVC" || layer["type"] === "VV") {
            cloudImg = (
              <div className="flex items-center justify-content-center">
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
                <img src="cbase.png" width={30} height={30} alt="cloud" />
              </div>
            );
          }
          return (
            <div
              key={i}
              className="flex gap-4 items-center text-sm md:text-md text-zinc-300"
            >
              <p>
                {layer["type"]} -{" "}
                {(layer["altitude"] * 100).toLocaleString() + "ft"}
              </p>
              {cloudImg}
            </div>
          );
        })
      ) : (
        <p>No Clouds</p>
      )}
    </div>
  );
}
