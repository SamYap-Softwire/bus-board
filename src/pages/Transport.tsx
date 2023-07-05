import React, { useState, useEffect } from "react";
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

const RELOAD_MS = 8000;

export default function Transport({
  transportMode,
  stoptype,
  radius,
}: TransportProps): React.ReactElement {
  const [postcode, setPostcode] = useState("");
  const [tableData, setTableData] = useState(
    <tr>
      <th></th>
    </tr>
  );
  const [errorData, setErrorData] = useState("");

  function loadTable() {
    setTableData(<Loading />);
    getTransports({
      postcode: postcode,
      stoptype: stoptype,
      radius: radius,
    }).then((data) => {
      if (typeof data == "string") {
        setErrorData(data);
        setTableData(
          <tr>
            <th></th>
          </tr>
        );
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
        setTableData(<table className="table">{table}</table>);
        setErrorData("");
      }
    });
  }

  let interval: NodeJS.Timer | null = null;

  function formHandler(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    loadTable();
    if (interval !== null) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      console.log(postcode);
      loadTable();
    }, RELOAD_MS);
  }

  return (
    <>
      <h1 className="title"> London {transportMode}Board </h1>
      <form action="" onSubmit={formHandler}>
        <div>
          <div className="postcodePrompt">
            Nearest {transportMode} Arrival Time
          </div>
          <div className="postcodeInputFlex">
            <div className="wrapper">
              <input
                className="postcodeInputBar"
                type="text"
                name="postcode"
                placeholder={"Search By Postcode e.g. NW51TL"}
                onChange={(data: React.ChangeEvent<HTMLInputElement>) => {
                  setPostcode(data.target.value);
                }}
              />
              <button type="submit" value="Submit" className="submitButton">
                <SearchOutline />
              </button>
            </div>
          </div>
        </div>
      </form>
      {!!errorData && <div className="errorMessage">{errorData}</div>}
      {!errorData && <div className="tableDiv">{tableData}</div>}
    </>
  );
}
