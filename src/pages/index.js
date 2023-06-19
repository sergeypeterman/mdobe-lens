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

const CONTENT_TYPES = [
  { name: 1, icon: faCamera, title: "photo" },
  { name: 2, icon: faDesktop, title: "illustration" },
  { name: 3, icon: faPenNib, title: "vector" },
  { name: 4, icon: faVideo, title: "video" },
  { name: 5, icon: faCube, title: "3d" },
  { name: 6, icon: faPenSquare, title: "template" },
];

const ORDER = [
  { name: "nb_downloads", title: "Downloads" },
  { name: "relevance", title: "Relevance" },
  { name: "creation", title: "Creation Date" },
  { name: "featured", title: "Featured" },
  { name: "undiscovered", title: "Undiscovered" },
  { name: "undiscovered", title: "Undiscovered" },
];
//[age]=1w, 1m, 6m, 1y, 2y, 3y
const AGE = [
  { name: "1w", title: "1 week" },
  { name: "1m", title: "1 month" },
  { name: "6m", title: "6 months" },
  { name: "1y", title: "1 year" },
  { name: "2y", title: "2 years" },
  { name: "3y", title: "3 years" },
];
const SETTINGS_TYPES = {
  order: {
    name: "order",
    type: "radio",
    caption: "Order by:",
    values: ORDER,
    selected: 0,
  },
  content: {
    name: "media_type_id",
    type: "checkbox",
    caption: "Content types:",
    values: CONTENT_TYPES,
    selected: [true, true, true, true, false, false],
  },
  age: {
    name: "age",
    type: "radio",
    caption: "Uploaded in the last:",
    values: AGE,
    selected: 2,
  },
  query: "",
};

function SettingsBlock({ type, settingsValues, setSettingsValues }) {
  let thisSetting = settingsValues[type];

  const handleBlockChange = (e) => {
    let newSet = JSON.parse(JSON.stringify(settingsValues));
    let num = +e.target.value;
    switch (thisSetting.type) {
      case "radio":
        newSet[type].selected = num;
        break;
      case "checkbox":
        newSet[type].selected[num] = !newSet[type].selected[num];
        break;
    }
    setSettingsValues(newSet);
  };

  return (
    <div className="bg-gray-100 hover:bg-gray-50 px-4 py-1 m-1 rounded-lg shadow-lg ">
      <fieldset className="">
        <legend className="font-bold text-lg">{thisSetting.caption}</legend>

        {thisSetting.values.map((item, ind) => {
          let checked = false;
          switch (thisSetting.type) {
            case "radio":
              checked = ind === thisSetting.selected;
              break;
            case "checkbox":
              checked = thisSetting.selected[ind];
              break;
          }
          return (
            <div key={`${item.name}`} className="flex">
              <input
                type={thisSetting.type}
                id={`${item.name}`}
                value={`${ind}`}
                name={thisSetting.name}
                onChange={handleBlockChange}
                checked={checked}
              />

              <label htmlFor={`${item.name}`} className="px-2 py-1">
                {item.title}
              </label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
}

function Settings({
  handleQuery,
  isEnter,
  query,
  handleFetchClick,
  settingsValues,
  setSettingsValues,
}) {
  const [settingsShow, setSettingsShow] = useState(false); //hamburger menu handler

  const handleSettingsFilter = () => {
    setSettingsShow(!settingsShow);
  };

  return (
    <div
      id="search-form"
      className={`w-full flex flex-col items-center fixed top-0 left-0 px-12 py-8 
      backdrop-blur-sm bg-gradient-to-b from-neutral-400 z-10`}
    >
      <div id="search-field" className="w-full flex flex-row items-center">
        <button
          id="search-settings"
          className="bg-gray-100 hover:bg-gray-200 text-center 
          px-3 py-1 ml-1 -mr-1 text-gray-400 rounded-l-lg text-lg "
          onClick={handleSettingsFilter}
        >
          <FontAwesomeIcon
            icon={faSliders}
            className={settingsShow ? `transition rotate-90` : `transition`}
          />
        </button>
        <input
          id="query-field"
          className="text-center px-3 py-1 m-1 text-black font-medium
                     rounded-r-lg bg-gray-100 hover:bg-gray-200 text-lg w-full"
          type="text"
          placeholder="type query..."
          onChange={handleQuery}
          onKeyDown={isEnter}
          value={query}
        />
        <button
          id="search-button"
          className="bg-sky-700 hover:bg-sky-900  text-center 
          px-3 py-1 m-1 text-white rounded-lg text-lg shadow-md active:shadow-none"
          onClick={handleFetchClick}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      {settingsShow ? (
        <div
          id="search-params"
          className="w-full max-h-[85vh] items-center m-1 overflow-auto"
        >
          <SettingsBlock
            settingsValues={settingsValues}
            setSettingsValues={setSettingsValues}
            type="order"
          />
          <SettingsBlock
            settingsValues={settingsValues}
            setSettingsValues={setSettingsValues}
            type="content"
          />
          <SettingsBlock
            settingsValues={settingsValues}
            setSettingsValues={setSettingsValues}
            type="age"
          />
        </div>
      ) : null}
    </div>
  );
}

function Card({ e }) {
  const [pressed, setPressed] = useState(false);

  const handleExpand = () => {
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
        <span>{`${e.creator_name} | ${e.creator_id}`}</span>
        <span title={CONTENT_TYPES[e.media_type_id - 1].title} className="px-1">
          <FontAwesomeIcon icon={CONTENT_TYPES[e.media_type_id - 1].icon} />
        </span>
      </div>
      {(CONTENT_TYPES[e.media_type_id - 1].title === "video") ? (
        <video
          controls
        >
          <source
            src={e.video_small_preview_url}
            type={e.video_small_preview_content_type}
          />
          <p>
            Your browser does not support HTML video. Here is a
            <a href={e.video_small_preview_url}>link to the video</a> instead.
          </p>
        </video>
      ) : (
        <Image
          className="h-48 w-auto object-contain cursor-pointer"
          src={e.thumbnail_url}
          width={e.thumbnail_width}
          height={e.thumbnail_height}
          alt={e.title}
          onClick={handleExpand}
        />
      )}
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
        <div onClick={handleExpand} className={`expand`}>
          <FontAwesomeIcon icon={faChevronUp} />
        </div>
      ) : (
        <div onClick={handleExpand} className={`expand`}>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [resp, setResp] = useState();
  //const [query, setQuery] = useState("");
  const [settingsValues, setSettingsValues] = useState(SETTINGS_TYPES); //main settings object

  const handleFetchClick = async () => {
    try {
      const res = await fetch(
        `/api/get-files?search=${JSON.stringify(settingsValues)}`
      );
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
    let newSet = JSON.parse(JSON.stringify(settingsValues));
    newSet.query = e.target.value;
    setSettingsValues(newSet);
  };

  const isEnter = (e) => {
    if (e.key === "Enter") {
      handleFetchClick();
    }
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center `}>
      <Settings
        handleQuery={handleQuery}
        isEnter={isEnter}
        query={settingsValues.query}
        handleFetchClick={handleFetchClick}
        settingsValues={settingsValues}
        setSettingsValues={setSettingsValues}
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
