import WorldTimes from "../components/worldtime";

export default function WorldTime() {
  return <WorldTimes />;
}

export const generateMetadata = async () => {
  return {
    title: "AirTime | BlueAero",
  };
};
