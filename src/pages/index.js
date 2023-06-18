import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faPenNib,
  faCamera,
  faVideo,
  faDesktop,
  faCube,
  faPenSquare,
  faMagnifyingGlass,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

const TYPES = {
  1: { icon: faCamera, title: "Photo" },
  2: { icon: faDesktop, title: "Illustration" },
  3: { icon: faPenNib, title: "Vector" },
  4: { icon: faVideo, title: "Video" },
  6: { icon: faCube, title: "3D" },
  7: { icon: faPenSquare, title: "Template" },
};

function Settings({ handleQuery, isEnter, query, handleClick }) {
  return (
    <div
      id="search-form"
      className="w-full flex flex-col items-center fixed top-0 left-0 px-12 py-8 
               backdrop-blur-sm bg-gradient-to-b from-neutral-400"
    >
      <div id="search-field" className="w-full flex flex-row items-center">
        
        <button
          className="bg-gray-100 hover:bg-gray-200 text-center 
          px-3 py-1 ml-1 -mr-1 text-gray-400 rounded-l-lg text-lg shadow-md "
          
        >
          <FontAwesomeIcon icon={faSliders} className="" />
        </button>
        <input
          className="text-center px-3 py-1 m-1 text-black shadow-md
                     rounded-r-lg bg-gray-100 hover:bg-gray-200 text-lg w-full"
          type="text"
          placeholder="type query..."
          onChange={handleQuery}
          onKeyDown={isEnter}
          value={query}
        />
        <button
          className="bg-sky-700 hover:bg-sky-900  text-center 
          px-3 py-1 m-1 text-white rounded-lg text-lg shadow-md active:shadow-none"
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      <div
        id="search-params"
        className="w-full flex flex-row items-center"
      ></div>
    </div>
  );
}

function Card({ e }) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(!pressed);
  };

  return (
    <div
      className="mb-2 bg-gradient-to-b w-full flex flex-col rounded-lg shadow-lg
                 from-neutral-100 from-85% to-neutral-50
                 "
    >
      <div className="text-sm flex justify-between p-1">
        <span className="px-1 font-bold">{e.nb_downloads}</span>
        <span>{e.creator_name}</span>
        <span title={TYPES[e.media_type_id].title} className="px-1">
          <FontAwesomeIcon icon={TYPES[e.media_type_id].icon} />
        </span>
      </div>
      <Image
        className="h-48 w-auto object-contain cursor-pointer"
        src={e.thumbnail_url}
        width={e.thumbnail_width}
        height={e.thumbnail_height}
        alt={e.title}
        onClick={handleClick}
      />
      <div className="text-sm flex justify-around p-1">
        <span className="px-1">{e.creation_date.substr(0, 7)}</span>
      </div>
      {pressed ? (
        <div className={`px-3 py-2`}>
          <p className="p-1 border-b-2">{e.title}</p>
          <p className="p-1">
            {e.keywords.reduce((acc, item) => (acc += `${item.name}, `), " ")}
          </p>
        </div>
      ) : null}
      {pressed ? (
        <div onClick={handleClick} className={`expand`}>
          <FontAwesomeIcon icon={faChevronUp} />
        </div>
      ) : (
        <div onClick={handleClick} className={`expand`}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      )}
    </div>
  );
}

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
    <main className={`flex min-h-screen flex-col items-center justify-center `}>
      <Settings
        handleQuery={handleQuery}
        isEnter={isEnter}
        query={query}
        handleClick={handleClick}
      />
      <div
        className="   text-center p-12 m-16 text-black 
                      rounded-md w-full
                      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        {resp
          ? resp.files.map((e, ind) => <Card key={`e-${ind}`} e={e} />)
          : null}
      </div>
    </main>
  );
}
