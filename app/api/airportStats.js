export default async function AirportStats(text, p) {
  const { FlightRadar24API } = require("flightradarapi");
  const frApi = new FlightRadar24API();

  let airportData;

  if (text && p) {
    airportData = frApi.getAirportDetails(text, 100, p);
  } else {
    airportData = frApi.getAirportDetails(text);
  }

  return airportData;
}
