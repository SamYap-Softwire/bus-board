// INTERFACES

export interface busObject {
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

export class returnObject {
  public error: boolean;
  public content: busObject[] | string[];

  public constructor(error: boolean, content: busObject[] | string[]) {
    this.error = error;
    this.content = content;
  }
  
}


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
  const busInfoArray = [];
  const sortedData = data.sort(
    (a: busObject, b: busObject) => a.timeToStation - b.timeToStation
  );
  const firstFive = sortedData.slice(0, 5);
  return firstFive;
};


export default async function main(postCode : string): Promise<returnObject> {
  const postCodeToLatLonAPI = `https://api.postcodes.io/postcodes/${postCode}`;
  const latLon = await postCodeToLatLon(postCodeToLatLonAPI);

  if (typeof(latLon) === 'string'){
    return new returnObject(true, [latLon])
  } 

  const [lat, lon] = getLatLon(latLon);

  let radius = 400; // can let users choose radius they want OR automatic
  const latLonToStopPointAPI = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram&radius=${radius}`;
  const stopPoint = await fetchByAwait(latLonToStopPointAPI);
  const idArray = getStopPoint(stopPoint.stopPoints);

  const busArray = await generateBusArray(idArray);
  const firstFiveBusArray = getBusInfo(busArray);
  let firstFiveBusInfo = firstFiveBusArray as busObject[];

  return new returnObject(false, firstFiveBusInfo);
  
}

// TODO: refactoring (clean code)

