export default async function WindsAloft() {
  const windsData =
    await fetch(`https://aviationweather.gov/api/data/windtemp?level=low&fcst=06
`);
  const windText = await windsData.text();
  const geoData = await fetch(
    `https://aviationweather.gov/api/data/windtemp?level=low&fcst=06&format=json`
  );
  const geo = await geoData.json();
  return [windText, geo.sites];
}
