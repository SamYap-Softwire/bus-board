import React, {useState} from 'react';
import getBus from './getBus'

async function getBuses(postcode: string): Promise<string> {
  // very basic testing string, you'll likely return a list of strings or JSON objects instead!
  return getBus();
  // return "some cool bus HTML generated from APIs goes here";
}

function App(): React.ReactElement {
  const [postcode, setPostcode] = useState("");  
  const [tableData, setTableData] = useState("");

  async function formHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    const data = await getBuses(postcode);
    setTableData(data);
  }

  return <>
    <h1> BusBoard </h1>
    <form action="" onSubmit={formHandler}>
      Postcode: &nbsp;
      <input type="text" name="postcode" onChange={(data: React.ChangeEvent<HTMLInputElement>) => setPostcode(data.target.value)}/>
      <br/>
      <input type="submit" value="Submit"/>
    </form>
    {tableData} 
  </>;
}

export default App;

