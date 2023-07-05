import React from "react";
import TransportMap from "./TransportMap";


function Metro(): React.ReactElement {
  return (
    <TransportMap transportMode="Metro" stoptype="NaptanMetroStation" radius={1000}/>
  );
}

export default Metro;
