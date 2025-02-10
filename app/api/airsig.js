export default async function AirSig() {
  const airData =
    await fetch(`https://aviationweather.gov/api/data/gairmet?format=json
  `);
  const air = await airData.json();

  const sigData =
    await fetch(`https://aviationweather.gov/api/data/airsigmet?format=json&type=sigmet
`);

  const sig = await sigData.json();
  return [air, sig];
}
