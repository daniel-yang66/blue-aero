import CurrentConditions from "./components/currentconditions";
import { Suspense } from "react";
import Loading from "./components/loading";
import WorldTimes from "./components/worldtime";
import Link from "next/link";
import Obstacles from "./api/obstacles";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const airportCode = await params.airportCode;
  const stored = await params.stored;

  return (
    <div className=" mt-[1vh] max-h-[80vh] w-full grid grid-rows-[30vh_3vh_1fr] md:grid-rows-[33vh_4vh_auto] gap-[1vh] justify-items-center">
      <Suspense fallback={<Loading />}>
        <CurrentConditions airportCode={airportCode} stored={stored} />
      </Suspense>
      <div className="flex gap-2">
        <Link
          className=" flex gap-2 font-semibold text-sm md:text-md text-neutral-800 items-center mt-[0.5vh] bg-blue-400 rounded-md p-2"
          href={`/`}
        >
          Performance
        </Link>
        <Link
          className=" flex gap-2 font-semibold text-sm md:text-md text-neutral-800 items-center mt-[0.5vh] bg-blue-400 rounded-md p-2"
          href={`/`}
        >
          NOTAMS
        </Link>
      </div>

      <Suspense fallback={<Loading />}>
        <WorldTimes airport={airportCode} />;
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
