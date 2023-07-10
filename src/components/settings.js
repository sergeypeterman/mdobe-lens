import {
  SettingsBlock,
  SettingsIntField,
  SettingsButtonsBlock,
} from "./settings-blocks";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

export function SettingsContainer({
  settingsShow,
  refSettings,
  settingsValues,
  setSettingsValues,
}) {
  return (
    <div className={`fixed top-28 left-0 w-full z-20 md:w-80`}>
      <div
        id="settings-form"
        className={`flex flex-col px-12 md:px-0`}
      >
        <div id="settings-elements" className="w-full">
          {settingsShow ? (
            <div
              id="search-params"
              ref={refSettings}
              className="w-full max-h-[85vh] md:p-3 items-center 
                      overflow-auto relative"
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
              <SettingsIntField
                settingsValues={settingsValues}
                setSettingsValues={setSettingsValues}
                type="creatorId"
              />
            </div>
          ) : (
            <div
              id="search-params"
              className="opacity-0 -translate-x-[40rem]"
            ></div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export function SearchContainer({
  handleFetchClick,
  isEnter,
  setSettingsShow,
  settingsShow,
  refSearch,
  handleQuery,
  query,
}) {
  const handleSettingsFilter = () => {
    setSettingsShow(!settingsShow);
  };

  return (
    <div className={`fixed top-0 left-0 w-full `}>
      <div
        id="search-form"
        ref={refSearch}
        className={`flex flex-col items-center px-12 py-8 `}
      >
        <div
          id="top-background"
          className={`fixed top-0 left-0 w-full z-10 h-28 px-12 py-8 bg-neutral-700`}
        ></div>
        <div id="search-elements" className="w-full z-20">
          <div
            id="search-field"
            className="flex flex-row items-center bg-neutral-700"
          >
            <button
              id="search-settings"
              className="bg-gray-100 hover:bg-gray-200 text-center 
                         px-3 py-1 ml-1 -mr-1 rounded-l-lg text-lg "
              onClick={handleSettingsFilter}
            >
              <FontAwesomeIcon
                icon={faSliders}
                className={
                  settingsShow
                    ? `transition rotate-90 text-gray-700`
                    : `transition text-gray-400`
                }
              />
            </button>
            <input
              id="query-field"
              className="text-center px-3 py-1 m-1 text-black font-medium
                     rounded-r-lg bg-gray-100 hover:bg-gray-200 text-lg w-full"
              type="text"
              placeholder="type query..."
              onChange={handleQuery}            
              onKeyDown={(e) => {
                if (isEnter(e) && settingsShow) {
                  handleSettingsFilter();
                }
              }}
              value={query}
            />
            <button
              id="search-button"
              className="bg-sky-600 hover:bg-sky-500  text-center 
                         px-3 py-1 m-1 text-white rounded-lg text-lg shadow-md active:shadow-none"
              onClick={() => {
                settingsShow && handleSettingsFilter();
                handleFetchClick();
              }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
/*
export function Settings({}) {
  //combined component for search and search settings. Maybe it's better to split them
  const refSettings = useRef();
  const refSearch = useRef();

  const [settingsShow, setSettingsShow] = useState(false); //hamburger menu handler

  const handleSettingsFilter = () => {
    setSettingsShow(!settingsShow);
  };

  useEffect(() => {
    const checkIfClickedInside = (e) => {
      if (
        settingsShow &&
        !refSettings.current.contains(e.target) &&
        !refSearch.current.contains(e.target)
      ) {
        setSettingsShow(false);
        console.log(e.target);
      }
    };

    document.addEventListener("mousedown", checkIfClickedInside);
    console.log("added");
    return () => {
      document.removeEventListener("mousedown", checkIfClickedInside);
      console.log("removed");
    };
  }, [settingsShow]);

  return (
    <div className={`fixed top-0 left-0 w-full `}>
      <div
        id="search-form"
        ref={refSearch}
        className={`flex flex-col items-center px-12 py-8 `}
      >
        <div
          id="top-background"
          className={`fixed top-0 left-0 w-full z-10 h-28 px-12 py-8 bg-neutral-700`}
        ></div>
        <div id="search-elements" className="w-full z-20">
          <div
            id="search-field"
            className="flex flex-row items-center bg-neutral-700"
          >
            <button
              id="search-settings"
              className="bg-gray-100 hover:bg-gray-200 text-center 
          px-3 py-1 ml-1 -mr-1 rounded-l-lg text-lg "
              onClick={handleSettingsFilter}
            >
              <FontAwesomeIcon
                icon={faSliders}
                className={
                  settingsShow
                    ? `transition rotate-90 text-gray-700`
                    : `transition text-gray-400`
                }
              />
            </button>
            <input
              id="query-field"
              className="text-center px-3 py-1 m-1 text-black font-medium
                     rounded-r-lg bg-gray-100 hover:bg-gray-200 text-lg w-full"
              type="text"
              placeholder="type query..."
              onChange={handleQuery}
              onKeyDown={(e) => {
                if (isEnter(e) && settingsShow) {
                  handleSettingsFilter();
                }
              }}
              value={query}
            />
            <button
              id="search-button"
              className="bg-sky-600 hover:bg-sky-500  text-center 
          px-3 py-1 m-1 text-white rounded-lg text-lg shadow-md active:shadow-none"
              onClick={() => {
                settingsShow && handleSettingsFilter();
                handleFetchClick();
              }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          {settingsShow ? (
            <div
              id="search-params"
              ref={refSettings}
              className="w-full max-h-[85vh] items-center bg-neutral-700
                      overflow-auto relative transition ease-out duration-300 opacity-100"
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
              <SettingsIntField
                settingsValues={settingsValues}
                setSettingsValues={setSettingsValues}
                type="creatorId"
              />
            </div>
          ) : (
            <div
              id="search-params"
              className="transition duration-300 ease-out opacity-50 -translate-x-[40rem]"
            ></div>
          )}
        </div>
        <div
          id="bottom-background"
          className={`fixed top-0 left-0 w-full z-10 h-full px-12 py-8 bg-neutral-700 
                      transition-all
                     ${
                       settingsShow
                         ? "duration-300 ease-out opacity-100 translate-x-0 blur-none"
                         : "duration-100 ease-out opacity-0 -translate-x-full blur-lg"
                     }`}
        ></div>
      </div>
    </div>
  );
}
*/
