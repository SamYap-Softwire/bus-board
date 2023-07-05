import React from "react";
import TransportMap from "./TransportMap";


function Bus(): React.ReactElement {
  return (
    <TransportMap transportMode="Bus" stoptype="NaptanPublicBusCoachTram" radius={400}/>
  );
}

export default Bus;
