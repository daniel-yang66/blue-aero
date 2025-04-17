import WorldTimes from "../components/worldtime";
import AirSig from "../api/airsig";

export default async function WorldTime() {
  const asData = await AirSig();

  return <WorldTimes as={asData} />;
}

export const generateMetadata = async () => {
  return {
    title: "Map | BlueAero",
  };
};
