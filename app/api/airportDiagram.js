export default async function AirportDiagram(airport) {
  try {
    let data;
    const res = await fetch(
      `https://api-v2.aviationapi.com/v2/charts?airport=${airport}&airac=0`
    );
    data = await res.json();
    data = data.charts && data.charts.airport_diagram  ? data.charts.airport_diagram[0].pdf_url : null;
  
    return data
  }
  catch {
    return null
}
}
