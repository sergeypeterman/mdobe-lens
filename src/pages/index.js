import { useEffect, useState } from "react";
import Image from "next/image";

const TYPES = {1: "Photo",
  2: "Illustration",
  3: "Vector",
  4: "Video",
  6: "3D",
  7: "Template",}

export default function Home() {
  const [resp, setResp] = useState();
  const [query, setQuery] = useState("");

  const handleClick = async () => {
    try {
      const res = await fetch(`/api/get-files?search=${query}`);
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

  const handleQuery = (e) => {
    setQuery(e.target.value);
  };

  const isEnter = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24`}
    >
      <div>
        <input
          className="bg-sky-700 hover:bg-sky-900 text-center px-3 py-1 m-1 text-white rounded-lg text-lg"
          type="text"
          onChange={handleQuery}
          onKeyDown={isEnter}
          value={query}
        />
        <button
          className="bg-sky-700 hover:bg-sky-900 text-center px-3 py-1 m-1 text-white rounded-lg text-lg"
          onClick={handleClick}
        >
          Fetch
        </button>
      </div>
      <div className="animation-all ease-in duration-300 bg-gray-400 hover:bg-gray-500 text-center p-1 m-1 text-white rounded-md text-lg">
        {resp
          ? resp.files.map((e, ind) => (
              <div key={`e-${ind}`}>
                <Image
                  className="p-1"
                  src={e.thumbnail_url}
                  width={e.thumbnail_width}
                  height={e.thumbnail_height}
                  alt={e.title}
                />
                <p className="text-sm w-full flex justify-between px-1">
                  <span>dls-{e.nb_downloads}</span>{" "}
                  <span>{TYPES[e.media_type_id]}</span>
                  <span>{e.creator_name}</span>
                  <span>{e.creation_date/* .substr(0, 4) */}</span>
                </p>
              </div>
            ))
          : null}
      </div>
    </main>
  );
}
