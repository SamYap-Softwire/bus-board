import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import { getTransportMap } from "./getTransport";

interface ChangeViewProps {
  center: [number, number];
}

function ChangeView({ center }: ChangeViewProps) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function SomeComponent() {
  const [centerPosition, setCenterPosition] = useState<[number, number]>([
    0, 0,
  ]); // sets initial center
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    0, 0,
  ]); // sets initial marker

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCenterPosition([latitude, longitude]);
      setMarkerPosition([latitude, longitude]);
    });
  }, []);

  function Markers() {
    const map = useMapEvents({
      click(e) {
        setCenterPosition([map.getCenter().lat, map.getCenter().lng]);
        setMarkerPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return markerPosition ? (
      <Marker
        key={markerPosition[0]}
        position={markerPosition}
        interactive={false}
      />
    ) : null;
  }

  return (
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
  );
}
