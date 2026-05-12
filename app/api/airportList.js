"use server";
export default async function AirportData(text) {
  const avwxKey = process.env.AVWX_TOKEN;
  let data;

  try {
    const res = await fetch(
      `https://avwx.rest/api/search/station?text=${text}&n=2&airport=true&reporting=true&format=json&token=${avwxKey}`,
    );
    data = await res.json();
  } catch {
    data = [];
  }

  return data;
}
