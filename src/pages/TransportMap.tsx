import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import { getTransportMap, transportObject } from "./getTransport";
import { Point, icon } from "leaflet";

interface TransportProps {
  transportMode: string;
  stoptype: string;
  radius: number;
}

interface getTransportsProps {
  latLon: [number, number];
  stoptype: string;
  radius: number;
}

interface ChangeViewProps {
  center: [number, number];
}

function ChangeView({ center }: ChangeViewProps) {
  const map = useMap();
  map.setView(center);
  return null;
}

async function getTransports({
  latLon,
  stoptype,
  radius,
}: getTransportsProps): Promise<any> {
  const returnedObject = await getTransportMap(latLon, stoptype, radius);
  if (returnedObject.error) {
    return returnedObject.content[0];
  }
  return returnedObject.content;
}

export default function TransportMap({
  transportMode,
  stoptype,
  radius,
}: TransportProps) {
  const [centerPosition, setCenterPosition] = useState<[number, number]>([
    51.5, -0.09,
  ]); // sets initial center to london
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    51.5, -0.09,
  ]); // sets initial marker to london

  const [tableData, setTableData] = useState([
    <tr>
      <th></th>
    </tr>,
  ]);

  const locationIcon = icon({
    iconUrl: require("../assets/marker.png"),
    iconSize: new Point(40, 40),
    iconAnchor: new Point(20, 50),
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCenterPosition([latitude, longitude]);
      setMarkerPosition([latitude, longitude]);
    });
  }, []);

  function Markers() {
    const map = useMapEvents({
      click(event) {
        setCenterPosition([map.getCenter().lat, map.getCenter().lng]);
        setMarkerPosition([event.latlng.lat, event.latlng.lng]);
        console.log("event", event.latlng.lat, event.latlng.lng)
        console.log("markerPosition", markerPosition)
        getTransports({
          latLon: [event.latlng.lat, event.latlng.lng], // why if we use markerPosition that it updates in the next rendering?
          stoptype: stoptype,
          radius: radius,
        }).then((data) => {
          console.log(data);
          let table = [
            <tr>
              <th className="tableHeading">Line ID</th>
              <th className="tableHeading">Destination</th>
              <th className="tableHeading">Time to arrival</th>
            </tr>,
          ];
          let newTable = data.map((eachData: transportObject) => (
            <tr key={eachData.id}>
              <td className="tableCellLineID">{eachData.lineId}</td>
              <td className="tableCell">{eachData.destinationName}</td>
              <td className="tableCell">
                {~~(eachData.timeToStation / 60)} min
              </td>
            </tr>
          ));
          table = table.concat(newTable);
          setTableData(table);
        });
      },
    });

    return markerPosition ? (
      <Marker
        key={markerPosition[0]}
        position={markerPosition}
        interactive={false}
        icon={locationIcon}
      />
    ) : null;
  }

  return (
    <>
      <h1 className="title"> London {transportMode}Board </h1>
      <div className="mapPrompt">Nearest {transportMode} Arrival Time</div>
      <MapContainer className="MapContainer" center={centerPosition} zoom={10}>
        <ChangeView center={centerPosition} />
        <Markers />
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
      <div className="tableDiv">
        <table className="table">{tableData}</table>
      </div>
    </>
  );
}
