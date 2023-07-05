// import apiKey from "../assets/api_key.txt";
// INTERFACES

export interface transportObject {
  id: number;
  lineId: number;
  destinationName: string;
  timeToStation: number;
}

interface latLonObject {
  latitude: number;
  longitude: number;
}

interface stopPointObject {
  distance: number;
  naptanId: string;
}

 interface returnObject {
  error: boolean;
  content: transportObject[] | string[];
}

let API_KEY = "";
fetch (require("../assets/api_key.txt")).then(r => r.text()).then(text => {API_KEY = text})
// FETCH FROM API

const fetchByAwait = async (url: string): Promise<any> => {
  let data = await fetch(url);
  let input = await data.json();
  return input;
};

const postCodeToLatLon = async (url: string): Promise<latLonObject | string> => { 
  try {
    let latLon = await fetchByAwait(url);
    if (latLon.status === 200) {
      return latLon.result;
    } else {
      return latLon.error;
    }
  } catch (error) {
    return "There is an error with the API."
  }
  
  
}


// PROCESS API RESPONSE

const getLatLon = (data: latLonObject) => {
  return [data.latitude, data.longitude];
};

const getStopPoint = (data: stopPointObject[]) => {
  if (data === undefined) {
    data = []
  }
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

const generateTransportArray = async (ids: string[]) => {
  let allTransportArray: transportObject[] = [];
  for (const id of ids) {
    const stopPointToArrivalAPI = `https://api.tfl.gov.uk/StopPoint/${id}/Arrivals?app_key=${API_KEY}`;
    const transportArray = await fetchByAwait(stopPointToArrivalAPI);
    allTransportArray = allTransportArray.concat(transportArray);
  }
  return allTransportArray;
};

const getTransportInfo = (data: transportObject[]) => {
  const sortedData = data.sort(
    (a: transportObject, b: transportObject) => a.timeToStation - b.timeToStation
  );
  const firstFive = sortedData.slice(0, 5);
  return firstFive;
};


export default async function getTransport(postCode : string, stopType: string, radius: number): Promise<returnObject> {
  const postCodeToLatLonAPI = `https://api.postcodes.io/postcodes/${postCode}`;

  const latLon = await postCodeToLatLon(postCodeToLatLonAPI);

  if (typeof(latLon) === 'string'){
    return {error: true, content: [latLon]}
  } 

  const [lat, lon] = getLatLon(latLon);
  console.log("postcode lat lon:", lat, lon);

  const latLonToStopPointAPI = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopType}&radius=${radius}&app_key=${API_KEY}`;
  const stopPoint = await fetchByAwait(latLonToStopPointAPI);
  const idArray = getStopPoint(stopPoint.stopPoints);

  const transportArray = await generateTransportArray(idArray);
  const firstFiveTransportArray = getTransportInfo(transportArray);
  let firstFiveTransportInfo = firstFiveTransportArray as transportObject[];

  return {error: false, content: firstFiveTransportInfo};
  
}
export async function getTransportMap(latLon : [number, number], stopType: string, radius: number): Promise<returnObject> {
  const [lat, lon] = latLon;
  console.log("map lat lon:", lat, lon);


  const latLonToStopPointAPI = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stopType}&radius=${radius}&app_key=${API_KEY}`;
  console.log(latLonToStopPointAPI);
  const stopPoint = await fetchByAwait(latLonToStopPointAPI);
  console.log(stopPoint);
  const idArray = getStopPoint(stopPoint.stopPoints);

  const transportArray = await generateTransportArray(idArray);
  const firstFiveTransportArray = getTransportInfo(transportArray);
  let firstFiveTransportInfo = firstFiveTransportArray as transportObject[];

  return {error: false, content: firstFiveTransportInfo};
  
}
