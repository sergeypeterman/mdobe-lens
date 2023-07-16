import { SettingsBlock, SettingsIntField } from "./settings-blocks";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { STYLE } from "./constants";
import { Paginator } from "./paginator";
import { useEffect, useState } from "react";

export function SearchContainer({
  handleFetchClick,
  isEnter,
  setSettingsShow,
  settingsShow,
  refSearch,
  setSettingsValues,
  settingsValues,
  currPage,
  setCurrPage,
  assetsCount,
  limit,
}) {
  const [tempQuery, setTempQuery] = useState("");

  useEffect(() => {
    setTempQuery(settingsValues.query);
  }, [settingsValues.query]);

  const handleSettingsFilter = () => {
    setSettingsShow(!settingsShow);
  };

  const handleQueryChange = (e) => {
    let q = e.target.value;
    setTempQuery(q);
  };

  const handleQueryBlur = (e) => {
    //alert(e.target.value);
    let q = e.target.value;
    setTempQuery(q);
    updateQuery(q);
  };

  const updateQuery = (newQuery) => {
    let newSet = JSON.parse(JSON.stringify(settingsValues));
    newSet.query = newQuery;
    setSettingsValues(newSet);
  };

  return (
    <>
      <div
        id="search-form"
        ref={refSearch}
        className={`w-full z-30 flex flex-col items-center `}
      >
        <div id="search-elements" className="w-full z-20">
          <div id="search-field" className="flex flex-row items-center w-full">
            <button
              id="search-settings"
              aria-label="Search Settings"
              className="bg-gray-100 hover:bg-gray-200 text-center 
                         pl-12 pr-3 py-2 -mr-1 text-xl "
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
              className="text-center px-3 py-2 text-black font-medium
                     bg-gray-100 hover:bg-gray-200 text-lg w-full"
              type="text"
              placeholder="type query..."
              onChange={handleQueryChange}
              onBlur={handleQueryBlur}
              onKeyDown={(e) => {
                if (isEnter(e)) {
                  settingsShow && handleSettingsFilter();
                  updateQuery(tempQuery);
                  e.target.blur();
                }
              }}
              value={tempQuery}
            />
            <button
              id="search-button"
              aria-label="Search"
              className="bg-gray-100 hover:bg-gray-200 text-center 
                         pl-3 pr-12 py-2 text-gray-700 text-lg active:shadow-none"
              onClick={() => {
                settingsShow && handleSettingsFilter();
                handleFetchClick();
              }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>
        <Paginator
          currPage={currPage}
          setCurrPage={setCurrPage}
          assetsCount={assetsCount}
          limit={limit}
        />
      </div>
    </>
  );
}

export function SettingsContainer({
  settingsShow,
  refSettings,
  settingsValues,
  setSettingsValues,
  settingsErr,
  setSettingsErr,
}) {
  return (
    <div
      id="settings-form"
      className={`flex flex-col px-2 md:px-0 ${STYLE.fontColor}`}
    >
      <div id="settings-elements" className="w-full">
        {settingsShow ? (
          <div className={`max-h-[85vh] md:p-3 `} ref={refSettings}>
            <div
              id="search-params"
              className="w-full items-center 
                      overflow-auto relative"
            >
              <SettingsBlock
                settingsValues={settingsValues}
                setSettingsValues={setSettingsValues}
                type="order"
                error={settingsErr}
                setError={setSettingsErr}
              />
              <SettingsBlock
                settingsValues={settingsValues}
                setSettingsValues={setSettingsValues}
                type="content"
                error={settingsErr}
                setError={setSettingsErr}
              />
              <SettingsBlock
                settingsValues={settingsValues}
                setSettingsValues={setSettingsValues}
                type="age"
                error={settingsErr}
                setError={setSettingsErr}
              />
            </div>
            <div id="search-fields" className="w-full relative ">
              <div
                className={`${STYLE.backColor} mx-1 rounded-sm shadow-sm
                flex overflow-auto items-center`}
              >
                <SettingsIntField
                  settingsValues={settingsValues}
                  setSettingsValues={setSettingsValues}
                  type="creatorId"
                  error={settingsErr}
                  setError={setSettingsErr}
                />
                <SettingsIntField
                  settingsValues={settingsValues}
                  setSettingsValues={setSettingsValues}
                  type="limit"
                  error={settingsErr}
                  setError={setSettingsErr}
                />
              </div>
              <div
                className={`${STYLE.textError} m-1 px-5 pb-2 basis-full text-right`}
              >
                {settingsErr.status && settingsErr.message}
              </div>
            </div>
          </div>
        ) : (
          <div
            id="search-params"
            className="opacity-0 -translate-x-[40rem]"
          ></div>
        )}
      </div>
    </div>
  );
}
