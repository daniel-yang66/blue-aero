import CurrentConditions from "./components/currentconditions";
import Runways from "./components/data";
import { Suspense } from "react";
import Loading from "./components/loading";
import Link from "next/link";
import AirportDiagram from "./api/airportDiagram";
export default async function Home({ searchParams }) {
  const params = await searchParams;
  const airportCode = await params.airportCode;
  const stored = await params.stored;
  let diagram;
  if (airportCode) {
    diagram = await AirportDiagram(airportCode);
  }

if(airportCode) {
  return (
    <div className=" mt-[1vh] max-h-[80vh] w-full grid grid-rows-[30vh_3vh_1fr] md:grid-rows-[33vh_4vh_auto] gap-[1vh] justify-items-center">
      <Suspense fallback={<Loading />}>
        <CurrentConditions airportCode={airportCode} stored={stored} />
      </Suspense>
      <div className="flex gap-2">
        <Link
          className=" flex gap-2 font-bold text-sm md:text-md text-zinc-800 items-center mt-[0.5vh] bg-zinc-400 rounded-md p-2"
          href={`/flights${airportCode ? `?airportCode=${airportCode}` : ""}`}
        >
          {airportCode} Flights
        </Link>

        <Link
          className=" flex gap-2 font-bold text-sm md:text-md text-zinc-800 items-center mt-[0.5vh] bg-zinc-400 rounded-md p-2"
          href={`/world`}
        >
          Map
        </Link>
        <Link
          className=" flex gap-2 font-bold text-sm md:text-md text-zinc-800 items-center mt-[0.5vh] bg-zinc-400 rounded-md p-2"
          href={`/e6b`}
        >
          E6B
        </Link>
        {diagram ? (
          <Link
            className=" flex gap-2 font-bold text-sm md:text-md text-zinc-800 items-center mt-[0.5vh] bg-zinc-400 rounded-md p-2"
            href={diagram}
          >
            Diagram
          </Link>
        ) : (
          ""
        )}
      </div>

      <Suspense fallback={<Loading />}>
        <Runways airportCode={airportCode} stored={stored} />
      </Suspense>
    </div>
  );
}
else {
  return <h1 className="text-xl md:text-2xl text-zinc-300 font-bold mt-[25vh]">Weather Status One Search Away</h1>
}
}

export const generateMetadata = async ({ searchParams }) => {
  const { airportCode } = await searchParams;
  const title = airportCode ? `${airportCode} | BlueAero` : "BlueAero";

  return {
    title: title,
  };
};
