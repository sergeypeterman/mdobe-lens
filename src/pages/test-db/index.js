import { useEffect, useState } from "react";

export default function Page() {
  const [messageFinal, setMessageFinal] = useState("Didn't try to connect");
  async function tryDb() {
    try {
      const res = await fetch("api/test-db-sql");

      if (!res.ok) {
        throw new Error(`Fetch error: ${res.statusText}`);
      }
      const result = await res.json();
      const { message } = await result;
      console.log(message);
      setMessageFinal(JSON.stringify(message));
    } catch (err) {
      console.log(err.message);
      setMessageFinal(err.message);
    }
  }

  useEffect(() => {
    console.log("calling trydb");
    tryDb();
  }, []);

  return <div>{messageFinal}</div>;
}
