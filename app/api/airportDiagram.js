export default async function AirportDiagram(airport) {
  let data;
  const res = await fetch(
    `https://api.aviationapi.com/v1/charts?apt=${airport}&group=2`
  );
  data = await res.json();
  data = data[`${airport}`][0] ? data[`${airport}`][0]["pdf_path"] : null;

  return data;
}
