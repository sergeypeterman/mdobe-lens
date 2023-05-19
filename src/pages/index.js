import { useEffect, useState } from "react";
import Image from "next/image";

const TYPES = {
  1: "Photo",
  2: "Illustration",
  3: "Vector",
  4: "Video",
  6: "3D",
  7: "Template",
};

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
      className={`flex min-h-screen flex-col items-center justify-center p-12`}
    >
      <div id="search-form" className="w-full flex flex-col items-center">
        <input
          className="bg-gray-100 hover:bg-gray-200 text-center px-3 py-1 m-1 text-black
          rounded-lg text-lg w-full"
          type="text"
          placeholder="type query..."
          onChange={handleQuery}
          onKeyDown={isEnter}
          value={query}
        />
        <button
          className="bg-sky-700 hover:bg-sky-900  text-center 
              px-10 py-1 mt-1 text-white rounded-lg text-lg "
          onClick={handleClick}
        >
          Fetch
        </button>
      </div>
      <div
        className="animation-all ease-in duration-300 text-center p-1 m-1 text-white 
                      rounded-md text-lg w-full
                      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        {resp
          ? resp.files.map((e, ind) => (
              <div
                key={`e-${ind}`}
                className="mb-2 bg-gray-400 w-full hover:bg-gray-500 flex flex-col rounded-lg"
              >
                <div className="text-sm flex justify-center p-1">
                  <p>
                    <span>{e.creator_name}</span>
                  </p>
                </div>
                <Image
                  className="h-48 w-auto object-contain"
                  src={e.thumbnail_url}
                  width={e.thumbnail_width}
                  height={e.thumbnail_height}
                  alt={e.title}
                />
                <div className="text-sm flex justify-between p-1">
                  <span className="font-bold">{e.nb_downloads}</span>{" "}
                  <span>{TYPES[e.media_type_id]}</span>
                  <span>{e.creation_date.substr(0, 7)}</span>
                </div>
              </div>
            ))
          : null}
      </div>
    </main>
  );
}
