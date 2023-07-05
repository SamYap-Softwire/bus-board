import React from "react";
import Transport from "./Transport";


function Bus(): React.ReactElement {
  return (
    <Transport transportMode="Bus" stoptype="NaptanPublicBusCoachTram" radius={400}/>
  );
}

export default Bus;
