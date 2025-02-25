import WorldTimes from "../components/worldtime";
import WindsAloft from "../api/winds";
import AirSig from "../api/airsig";

export default async function WorldTime({ searchParams }) {
  const params = await searchParams;

  const winds = await WindsAloft();
  const asData = await AirSig();
  const windStatus = await params.status;
  console.log(windStatus);

  return <WorldTimes wind={winds} as={asData} status={windStatus} />;
}

export const generateMetadata = async () => {
  return {
    title: "Map | BlueAero",
  };
};
