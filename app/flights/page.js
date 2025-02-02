import Flights from "../components/flights";
import { Suspense } from "react";
import Loading from "../components/loading";
import Link from "next/link";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const airportCode = await params.airportCode;

  return (
    <div className="w-screen h-[85vh] grid grid-rows-[30px_auto] justify-items-center relative">
      <div className="grid gap-2 text-neutral-300 absolute -top-4 left-1 text-sm md:text-md font-semibold">
        <Link
          className="bg-blue-500 p-1 rounded-lg text-center"
          href={`${airportCode ? `/?airportCode=${airportCode}` : "/"}`}
        >
          {airportCode ? `${airportCode} Info` : "Info"}
        </Link>
      </div>
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
