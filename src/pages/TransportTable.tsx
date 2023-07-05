import React, { useState, Suspense } from "react";
import getTransport, { transportObject } from "./getTransport";
import { SearchOutline } from "react-ionicons";
import Loading from "./Loading";

interface Props {
  postcode: string;
  stoptype: string;
  radius: number;
}

interface TransportProps {
  transportMode: string;
  stoptype: string;
  radius: number;
}

async function getTransports({
  postcode,
  stoptype,
  radius,
}: Props): Promise<any> {
  //"NW51TL" // might want to change any
  const returnedObject = await getTransport(postcode, stoptype, radius);
  if (returnedObject.error) {
    return returnedObject.content[0];
  }
  return returnedObject.content;
}

export default async function TransportTable({
  transportMode,
  stoptype,
  radius,
}: TransportProps): Promise<any> {
  const [postcode, setPostcode] = useState("");
  const [tableData, setTableData] = useState([
    <tr>
      <th></th>
    </tr>,
  ]);
  const [errorData, setErrorData] = useState("");

  function formHandler(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    getTransports({
      postcode: postcode,
      stoptype: stoptype,
      radius: radius,
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
        let newTable = data.map((eachData: transportObject) => (
          <tr>
            <td className="tableCellLineID">{eachData.lineId}</td>
            <td className="tableCell">{eachData.destinationName}</td>
            <td className="tableCell">{~~(eachData.timeToStation / 60)} min</td>
          </tr>
        ));
        table = table.concat(newTable);
        setTableData(table);
        setErrorData("");
      }
    });
  }

  return (
    <>
      {!!errorData && <div className="errorMessage">{errorData}</div>}
      {!errorData && (
        <div className="tableDiv">
          <table className="table">{tableData}</table>
        </div>
      )}
    </>
  );
}
