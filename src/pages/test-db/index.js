import { useState } from "react";

function checkValidJSON(str) {
  try {
    JSON.parse(str);
  } catch (err) {
    return false;
  }
  return true;
}

function PrintObject({ d }) {
  if (Object.keys(d).length > 0) {
    let printedArray = [];
    let ind = `${d.id}`;
    for (const [key, val] of Object.entries(d)) {
      printedArray.push(
        <div key={`${key}-${ind}`}>
          {key}: {JSON.stringify(val)}
        </div>
      );
    }
    return printedArray;
  } else {
    return <div>Empty response</div>;
  }
}

export default function Page() {
  const [messageFinal, setMessageFinal] = useState("Didn't try to connect");
  const [data, setData] = useState([]);
  async function tryDb() {
    console.log("calling tryDB");
    try {
      const res = await fetch("api/test-db-sql");

      if (!res.ok) {
        const error = await res.json();
        console.log(res);
        throw new Error(`Fetch error: ${JSON.stringify(error.message)}`);
      }
      const result = await res.json();
      const { message } = await result;
      console.log(message);
      setMessageFinal(JSON.stringify(message));
      setData(message);
    } catch (err) {
      console.log(err.message);
      setMessageFinal(err.message);
    }
  }

  return (
    <>
      <button onClick={tryDb} className="bg-neutral-200 p-2">
        Test and Get data
      </button>

      <div>{messageFinal}</div>
      <h1>Data:</h1>
      {data.map((row, ind) => (
        <PrintObject key={`row-${ind}`} d={row} />
      ))}
    </>
  );
}
