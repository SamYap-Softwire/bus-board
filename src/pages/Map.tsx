import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import { getTransportMap, transportObject } from "./getTransport";
import { LeafletMouseEvent } from "leaflet";

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
  //"NW51TL" // might want to change any
  const returnedObject = await getTransportMap(latLon, stoptype, radius);
  if (returnedObject.error) {
    return returnedObject.content[0];
  }
  return returnedObject.content;
}

export default function SomeComponent() {
  const [centerPosition, setCenterPosition] = useState<[number, number]>([
    51.5, -0.09,
  ]); // sets initial center
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    51.5, -0.09,
  ]); // sets initial marker

  const [tableData, setTableData] = useState([
    <tr>
      <th></th>
    </tr>,
  ]);
  const [errorData, setErrorData] = useState("");

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const { latitude, longitude } = position.coords;
//       setCenterPosition([latitude, longitude]);
//       setMarkerPosition([latitude, longitude]);
//     });
//   }, []);

  function Markers() {
    const map = useMapEvents({
      click(event) {
        setCenterPosition([map.getCenter().lat, map.getCenter().lng]);
        setMarkerPosition([event.latlng.lat, event.latlng.lng]);
        formHandler();
      },
    });

    function formHandler(): void {
      getTransports({
        latLon: markerPosition,
        stoptype: "NaptanPublicBusCoachTram",
        radius: 400,
      }).then((data) => {
        if (typeof data == "string") {
          setErrorData(data);
          setTableData([
            <tr>
              <th></th>
            </tr>,
          ]);
        } else {
          let table = [
            <tr>
              <th className="tableHeading">Line ID</th>
              <th className="tableHeading">Destination</th>
              <th className="tableHeading">Time to arrival</th>
            </tr>,
          ];
          let newTable = data.map((eachData: transportObject) => {
            return (
              <tr>
                <td className="tableCellLineID">{eachData.lineId}</td>
                <td className="tableCell">{eachData.destinationName}</td>
                <td className="tableCell">
                  {~~(eachData.timeToStation / 60)} min
                </td>
              </tr>
            );
          });
          table = table.concat(newTable);
          setTableData(table);
          setErrorData("");
        }
      });
    }

    return markerPosition ? (
      <Marker
        key={markerPosition[0]}
        position={markerPosition}
        interactive={false}
      />
    ) : null;
  }

  return (
    <>
      <MapContainer
        center={centerPosition}
        zoom={10}
        style={{ height: "500px", width: "500px" }}
      >
        <ChangeView center={centerPosition} />
        <Markers />
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
      <h1 className="title"> London BusBoard </h1>
      {!!errorData && <div className="errorMessage">{errorData}</div>}
      {!errorData && (
        <div className="tableDiv">
          <table className="table">{tableData}</table>
        </div>
      )}
    </>
  );
}
