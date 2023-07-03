// INTERFACES

interface busObject {
  lineId: number;
  destinationName: string;
  timeToStation: number;
  timeToLive: Date;
}

interface latLonObject {
  latitude: number;
  longitude: number;
}

interface stopPointObject {
  distance: number;
  naptanId: string;
}

// INTERFACES

interface busObject {
  lineId: number;
  destinationName: string;
  timeToStation: number;
  timeToLive: Date;
}

interface latLonObject {
  latitude: number;
  longitude: number;
}

interface stopPointObject {
  distance: number;
  naptanId: string;
}

// FETCH FROM API

const fetchByAwait = async (url: string): Promise<any> => {
  try {
    let data = await fetch(url);
    let input = await data.json();
    return input;
  } catch (error) {
    throw new Error(`${error}`); // help
  }
};

// PROCESS API RESPONSE

const getLatLon = (data: latLonObject) => {
  return [data.latitude, data.longitude];
};

const getStopPoint = (data: stopPointObject[]) => {
  const sortedData = data.sort(
    (a: stopPointObject, b: stopPointObject) => a.distance - b.distance
  );
  const firstTwo = sortedData.slice(0, 2);
  const idArray: string[] = [];
  for (const stop of firstTwo) {
    idArray.push(stop.naptanId);
  }
  return idArray;
};

const generateBusArray = async (ids: string[]) => {
  let allBusArray: busObject[] = [];
  for (const id of ids) {
    const stopPointToArrivalAPI = `https://api.tfl.gov.uk/StopPoint/${id}/Arrivals`;
    const busArray = await fetchByAwait(stopPointToArrivalAPI);
    allBusArray = allBusArray.concat(busArray);
  }
  return allBusArray;
};

const getBusInfo = (data: busObject[]) => {
  const sortedData = data.sort(
    (a: busObject, b: busObject) => a.timeToStation - b.timeToStation
  );
  const firstFive = sortedData.slice(0, 5);
  return firstFive;
};

// DISPLAY DATA

const display = (arrivingBusArray: busObject[]) => {
  let returnString = "";
  for (const bus of arrivingBusArray) {
    returnString += `ID: ${bus.lineId}, Destination: ${
      bus.destinationName
    }, Time of arrival: ${~~(bus.timeToStation / 60)} min \n`;
  }
  return returnString;
};

export default async function main() {
  const postCode = "NW51TL"; // can check if postcode is valid 
  const postCodeToLatLonAPI = `https://api.postcodes.io/postcodes/${postCode}`;
  const latLon = await fetchByAwait(postCodeToLatLonAPI);
  const [lat, lon] = getLatLon(latLon.result);

  let radius = 400; // can let users choose radius they want OR automatic
  const latLonToStopPointAPI = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram&radius=${radius}`;
  const stopPoint = await fetchByAwait(latLonToStopPointAPI);
  const idArray = getStopPoint(stopPoint.stopPoints);

  const busArray = await generateBusArray(idArray);
  const firstFiveBusArray = getBusInfo(busArray);
  const displayString = display(firstFiveBusArray);
  const returnString =
    displayString === undefined ? "undefined" : displayString;
  return returnString;
}

// TODO: return a JSON object from this file (instead of string) to turn into displayable string on frontend (maybe using br)
// TODO: take in the postcode from App and use to make API call 
// TODO: Format display data (make it look nicer)
