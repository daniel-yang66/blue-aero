import { Suspense } from "react";
import Loading from "./components/loading";
import Display from "./components/display";
import Info from "./components/mapInfo";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const airportCode = await params.airportCode;
  const route = await params.route;

  return (
    <div className="mt-[1vh] max-h-[82vh] md:max-h-[95vh] w-full grid grid-rows-[50vh_40vh] md:grid-rows-[33vh_auto] gap-[1vh] justify-items-center overflow-auto">
      <Suspense fallback={<Loading />}>
        <Display
          airportCode={airportCode}
          route={route ? route.split(",") : null}
        />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <Info airport={airportCode} route={route ? route.split(",") : null} />;
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
