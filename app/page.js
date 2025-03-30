import { Suspense } from "react";
import Loading from "./components/loading";
import WorldTimes from "./components/worldtime";
import Display from "./components/display";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const airportCode = await params.airportCode;
  const stored = await params.stored;

  return (
    <div className=" mt-[1vh] max-h-[80vh] w-full grid grid-rows-[30vh_1fr] md:grid-rows-[33vh_auto] gap-[1vh] justify-items-center">
      <Suspense fallback={<Loading />}>
        <Display airportCode={airportCode} stored={stored} />
      </Suspense>

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
