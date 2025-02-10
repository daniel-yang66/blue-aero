import WorldTimes from "../components/worldtime";
import WindsAloft from "../api/winds";
import AirSig from "../api/airsig";

export default async function WorldTime() {
  const winds = await WindsAloft();
  const asData = await AirSig();
  return <WorldTimes wind={winds} as={asData} />;
}

export const generateMetadata = async () => {
  return {
    title: "Map | BlueAero",
  };
};
