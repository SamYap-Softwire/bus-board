import React, { useState } from "react";
import getBus, { busObject, returnObject } from "./getBus";
import { log } from "console";

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

function App(): React.ReactElement {
  const [postcode, setPostcode] = useState("");
  const [tableData, setTableData] = useState([<tr><th></th></tr>]);
  const [errorData, setErrorData] = useState("");

  function formHandler(event: React.FormEvent<HTMLFormElement>): any {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    getBuses({ postcode: postcode }).then((data) => {
      if (typeof data == "string") {
        setErrorData(data);
      } else {
        let table = [<tr><th>Line ID</th><th>Destination</th><th>Time to arrival</th></tr>]
        let newTable = data.map((eachData : busObject) => {return <tr><td>{eachData.lineId}</td><td>{eachData.destinationName}</td><td>{~~(eachData.timeToStation/60)}</td></tr>});
        table = table.concat(newTable)
        setTableData(table);
      }
    });
  }

  // function Container(): React.ReactElement {
  //   return (
  //     <>
  //       <h1> BusBoard </h1>
  //       <form action="" onSubmit={formHandler}>
  //         Postcode: &nbsp;
  //         <input
  //           type="text"
  //           name="postcode"
  //           onChange={(data: React.ChangeEvent<HTMLInputElement>) => {
  //             console.log(data.target.value)
  //             setPostcode(data.target.value);
  //           }}
  //         />
  //         <br />
  //         <input type="submit" value="Submit" />
  //       </form>
  //     </>
  //   );
  // }
  if (!!errorData) {
    return (
      <>
        <h1> BusBoard </h1>
        <form action="" onSubmit={formHandler}>
          Postcode: &nbsp;
          <input
            type="text"
            name="postcode"
            onChange={(data: React.ChangeEvent<HTMLInputElement>) => {
              setPostcode(data.target.value);
            }}
          />
          <br />
          <input type="submit" value="Submit" />
        </form>
        {errorData}
      </>
    );
  }
  return (
    <>
      <h1> BusBoard </h1>
      <form action="" onSubmit={formHandler}>
        Postcode: &nbsp;
        <input
          type="text"
          name="postcode"
          onChange={(data: React.ChangeEvent<HTMLInputElement>) => {
            setPostcode(data.target.value);
          }}
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
      <table>
        {tableData}
      </table>
    </>
  );

  // return (
  //   <>
  //     <Container />
  //     {"hi"}
  //   </>
  // );
}

export default App;
