import { Suspense } from "react";
import AirportStats from "../api/airportStats";
import Details from "./flightDetails";
import Loading from "./loading";

export default async function Flights({ air }) {
  let departures = [];
  let arrivals = [];
  let imageData = [];
  let data, depPages, arrPages, country;

  try {
    if (air) {
      data = await AirportStats(air, false);
      const dep1 = data.airport.pluginData.schedule.departures.data;
      const arr1 = data.airport.pluginData.schedule.arrivals.data;
      country = data.airport.pluginData.details.position.country.id;

      data.aircraftImages.forEach((img) => {
        if (!img.images) return;
        let obj = {};
        const reg = img.registration;
        const src = img.images.thumbnails[0].src;
        const copy = img.images.thumbnails[0].copyright;
        obj.reg = reg;
        obj.src = src;
        obj.copy = copy;
        imageData.push(obj);
      });

      departures = [...dep1];
      arrivals = [...arr1];
    }
  } catch {
    data = false;
  }

  if (data) {
    depPages = data.airport.pluginData.schedule.departures.page.total;
    arrPages = data.airport.pluginData.schedule.arrivals.page.total;
    let pages = depPages > arrPages ? depPages : arrPages;
    if (pages > 4) {
      pages = 4;
    }

    for (let i = 2; i <= pages; i++) {
      const pageData = await AirportStats(air, i);

      const pageDepartures =
        pageData.airport.pluginData.schedule.departures.data;
      departures = [...pageDepartures, ...departures];

      const pageArrivals = pageData.airport.pluginData.schedule.arrivals.data;
      arrivals = [...pageArrivals, ...arrivals];
    }
  }

  return (
    <Suspense fallback={<Loading />} key={air}>
      <Details
        dep={departures}
        arr={arrivals}
        code={air}
        img={imageData}
        cty={country}
      />
    </Suspense>
  );
}
