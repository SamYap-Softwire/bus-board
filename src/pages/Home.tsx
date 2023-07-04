import React, { useState } from "react";
import getBus, { busObject, returnObject } from "./getBus";
import {SearchOutline} from 'react-ionicons';

interface Props {
  postcode: string;
}

async function getBuses({ postcode }: Props): Promise<any> {
  //"NW51TL" // might want to change any
  const returnedObject = await getBus(postcode);
  if (returnedObject.error) {
    return returnedObject.content[0];
  }
  return returnedObject.content;
}

function Home(): React.ReactElement {
  const [postcode, setPostcode] = useState("");
  const [tableData, setTableData] = useState([
    <tr>
      <th></th>
    </tr>,
  ]);
  const [errorData, setErrorData] = useState("");

  function formHandler(event: React.FormEvent<HTMLFormElement>): any {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    getBuses({ postcode: postcode }).then((data) => {
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
        let newTable = data.map((eachData: busObject) => {
          return (
            <tr>
              <td className="tableCell">{eachData.lineId}</td>
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

  return (
    <>
      <h1 className="title"> BusBoard </h1>
      <form action="" onSubmit={formHandler}>
        <div>
          <div className="postcodePrompt">Nearest Bus Arrival Time</div>
          <div className="postcodeInputFlex">
            <div className="wrapper">
              <input
                className="postcodeInputBar"
                type="text"
                name="postcode"
                placeholder="Search By Postcode e.g. NW51TL"
                onChange={(data: React.ChangeEvent<HTMLInputElement>) => {
                  setPostcode(data.target.value);
                }}
              />
              <button type="submit" value="Submit" className="submitButton"><SearchOutline /></button>
            </div>
          </div>
        </div>
      </form>
      {!!errorData && <div className="errorMessage">{errorData}</div>}
      {!errorData && (
        <div className="tableDiv">
          <table className="table">{tableData}</table>
        </div>
      )}
    </>
  );
}

export default Home;
