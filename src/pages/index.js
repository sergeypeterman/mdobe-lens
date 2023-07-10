import { useEffect, useRef, useState } from "react";
import { SETTINGS_TYPES } from "@/components/constants";
import { SettingsContainer, SearchContainer } from "@/components/settings";
import { Card } from "@/components/card";

export default function Home() {
  //main page component
  const [resp, setResp] = useState();
  const [settingsValues, setSettingsValues] = useState(SETTINGS_TYPES); //main settings object
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
    //console.log("added");
    return () => {
      document.removeEventListener("mousedown", checkIfClickedInside);
      //console.log("removed");
    };
  }, [settingsShow]);

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
      return true;
    }
    return false;
  };

  return (
    <main className={`flex min-h-screen flex-col `}>
      <SearchContainer
        handleFetchClick={handleFetchClick}
        isEnter={isEnter}
        settingsShow={settingsShow}
        setSettingsShow={setSettingsShow}
        handleQuery={handleQuery}
        query={settingsValues.query}
        refSearch={refSearch}
      />
      <div
        id="screen-background"
        className={`fixed top-28 left-0 h-full px-12 py-8 bg-neutral-700 w-full
                      transition-all duration-300 easy-out  ${
                        settingsShow
                          ? "z-10 blur-none opacity-100 md:opacity-20"
                          : "-z-[1] blur-lg opacity-0 md:opacity-0"
                      }`}
      ></div>
      <div className={`flex w-full`}>
        {settingsShow && (
          <SettingsContainer
            settingsShow={settingsShow}
            refSettings={refSettings}
            settingsValues={settingsValues}
            setSettingsValues={setSettingsValues}
          />
        )}
        <div
          className={`text-center p-12 mt-20 
                      ${settingsShow && "md:ml-72"}
                      text-black rounded-md w-full
                      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
                      lg:grid-cols-4 gap-4`}
        >
          {resp
            ? resp.files.map((e, ind) => <Card key={`e-${ind}`} e={e} />)
            : null}
        </div>
      </div>
    </main>
  );
}
