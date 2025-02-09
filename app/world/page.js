import WorldTimes from "../components/worldtime";
import WindsAloft from "../api/winds";

export default async function WorldTime() {
  const winds = await WindsAloft();
  return <WorldTimes wind={winds} />;
}

export const generateMetadata = async () => {
  return {
    title: "Map | BlueAero",
  };
};
