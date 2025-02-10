import Flights from "../components/flights";
import { Suspense } from "react";
import Loading from "../components/loading";
import Link from "next/link";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const airportCode = await params.airportCode;

  return (
    <div className="w-screen h-[85vh] grid grid-rows-[30px_auto] justify-items-center relative">
      <p className="font-bold text-neutral-300 text-xl mt-[0.5vh]">
        {airportCode} Flight Outlook (6H)
      </p>

      <Suspense fallback={<Loading />}>
        <Flights air={airportCode} />
      </Suspense>
    </div>
  );
}

export const generateMetadata = async ({ searchParams }) => {
  const { airportCode } = await searchParams;
  const title = airportCode ? `${airportCode} Flights | BlueAero` : "BlueAero";

  return {
    title: title,
  };
};
