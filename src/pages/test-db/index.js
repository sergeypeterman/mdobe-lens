import { useState } from "react";

export default function Page() {
  const [messageFinal, setMessageFinal] = useState("Didn't try to connect");
  const tryDb = async () => {
    try {
      const res = await fetch("api/test-db-sql");

      if (!res.ok) {
        throw new Error(`Fetch error: ${res.statusText}`);
      }
      const result = await res.json();
      const { message } = result;
      //console.log(message);
      setMessageFinal(message);
    } catch (err) {
      console.log(err.message);
      setMessageFinal(err.message);
    }
  };
  tryDb();
  return <div>{messageFinal}</div>;
}
