"use server";
export default async function Obstacles(lat1, lon1, lat2, lon2) {
  const obstacleData = await fetch(
    `https://aviationweather.gov/api/data/obstacle?bbox=${lat1}%2C${lon1}%2C${lat2}%2C${lon2}&format=json
`
  );

  const obstacleData2 = await fetch(
    `https://aviationweather.gov/api/data/feature?bbox=${lat1}%2C${lon1}%2C${lat2}%2C${lon2}&format=json
`
  );

  const obstacles = await obstacleData.json();
  const obstacle2 = await obstacleData2.json();

  return [...obstacles, ...obstacle2];
}
