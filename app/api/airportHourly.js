"use server";
export default async function AirportHourly(coords) {
  const tmrKey = process.env.TMR_TOKEN;
  let data;
  const res = await fetch(
    `https://api.tomorrow.io/v4/weather/forecast?location=${coords}&timesteps=1h&units=imperial&apikey=${tmrKey}`,
  );
  data = await res.json();

  return data["timelines"]["hourly"];
}
