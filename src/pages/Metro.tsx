import React from "react";
import Transport from "./Transport";


function Metro(): React.ReactElement {
  return (
    <Transport transportMode="Metro" stoptype="NaptanMetroStation" radius={500}/>
  );
}

export default Metro;
