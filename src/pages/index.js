import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [resp, setResp] = useState();

  const handleClick = async () => {
    try {
      const res = await fetch("/api/get-files");
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const result = await res.json();
      const { response } = result;
      setResp(response);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-row items-center justify-center p-24`}
    >
      <button
        className="bg-sky-700 hover:bg-sky-900 text-center px-5 py-3 m-1 text-white rounded-lg text-lg"
        onClick={handleClick}
      >
        Fetch Christmas
      </button>
      <div className="bg-green-700 hover:bg-sky-900 text-center px-5 py-3 m-1 text-white rounded-lg text-lg">
        {resp
          ? Object.getOwnPropertyNames(resp.files[0]).map((e, ind) => (
              <p key={ind}>{e}</p>
            ))
          : null}
      </div>
      <div className="bg-green-700 hover:bg-sky-900 text-center px-5 py-3 m-1 text-white rounded-lg text-lg">
        {resp
          ? resp.files.map((e, ind) => (
              <Image
                src={e.thumbnail_url}
                width={e.thumbnail_width}
                height={e.thumbnail_height}
                alt={e.title}
                key={`e-${ind}`}
              />
            ))
          : null}
      </div>
    </main>
  );
}
