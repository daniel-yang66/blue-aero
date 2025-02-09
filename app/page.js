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

  return (
    <div className=" mt-[1vh] max-h-[80vh] w-full grid grid-rows-[30vh_3vh_1fr] md:grid-rows-[33vh_4vh_auto] gap-[1vh] justify-items-center">
      <Suspense fallback={<Loading />}>
        <CurrentConditions airportCode={airportCode} stored={stored} />
      </Suspense>
      <div className="flex gap-2">
        <Link
          className=" flex gap-2 font-semibold text-sm md:text-md text-neutral-800 items-center mt-[0.5vh] bg-blue-400 rounded-md p-2"
          href={`/flights${airportCode ? `?airportCode=${airportCode}` : ""}`}
        >
          {airportCode} Flights
        </Link>

        <Link
          className=" flex gap-2 font-semibold text-sm md:text-md text-neutral-800 items-center mt-[0.5vh] bg-blue-400 rounded-md p-2"
          href={`/world`}
        >
          Map
        </Link>
        <Link
          className=" flex gap-2 font-semibold text-sm md:text-md text-neutral-800 items-center mt-[0.5vh] bg-blue-400 rounded-md p-2"
          href={`/e6b`}
        >
          E6B
        </Link>
        {diagram ? (
          <Link
            className=" flex gap-2 font-semibold text-sm md:text-md text-neutral-800 items-center mt-[0.5vh] bg-blue-400 rounded-md p-2"
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

export const generateMetadata = async ({ searchParams }) => {
  const { airportCode } = await searchParams;
  const title = airportCode ? `${airportCode} | BlueAero` : "BlueAero";

  return {
    title: title,
  };
};
