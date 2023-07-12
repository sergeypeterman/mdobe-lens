import { useCallback, useEffect, useRef, useState } from "react";
import { SETTINGS_TYPES, STYLE } from "@/components/constants";
import { SettingsContainer, SearchContainer } from "@/components/settings";
import { Card } from "@/components/card";
import Head from "next/head";

export default function Home() {
  //main page component

  const [resp, setResp] = useState();
  const [settingsValues, setSettingsValues] = useState(SETTINGS_TYPES); //main settings object
  const [settingsRead, setSettingssRead] = useState(false); //were the settings read from localStorage
  const [currPage, setCurrPage] = useState(1);

  const refSettings = useRef();
  const refSearch = useRef();

  const [settingsShow, setSettingsShow] = useState(false); //hamburger menu handler

  //reading settings from browser cache on the first load
  useEffect(() => {
    const localSettings = JSON.parse(localStorage.getItem(`searchSettings`));
    if (localSettings) {
      console.log(`reading searchSettings`);
      setSettingsValues(localSettings);
    }
    setSettingssRead(true);
  }, []);

  //saving settings to browser cache
  useEffect(() => {
    settingsRead &&
      localStorage.setItem(`searchSettings`, JSON.stringify(settingsValues));
    settingsRead && console.log(`writing searchSettings`);
  }, [settingsValues, settingsRead]);

  //fetch function
  const handleFetchClick = useCallback(async () => {
    let offset = (currPage - 1) * settingsValues.limit.values;
    let fetchURL = `/api/get-files?search=${JSON.stringify(
      settingsValues
    )}&offset=${offset}`;

    try {
      const res = await fetch(fetchURL);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const result = await res.json();
      const { response } = result;
      setResp(response);
    } catch (err) {
      alert(err.message);
    }
  }, [settingsValues, currPage]);

  //effect checks if the user clicked outside of the open settings menu
  //and fetches with applied settings
  useEffect(() => {
    const checkIfClickedInside = (e) => {
      if (
        settingsShow &&
        !refSettings.current.contains(e.target) &&
        !refSearch.current.contains(e.target)
      ) {
        setSettingsShow(false);
      }
    };

    handleFetchClick();
    document.addEventListener("mousedown", checkIfClickedInside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedInside);
    };
  }, [settingsShow, handleFetchClick]);

  //handling system-wide dark mode changes
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        const colorScheme = event.matches ? "dark" : "light";
        console.log(`${colorScheme} mode applied`); // "dark" or "light"
        if (colorScheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      });

    return window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", (event) => {});
  }, []);

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
    <>
      <Head>
        <title>mdobeLens</title>
      </Head>
      <main className={`flex min-h-screen flex-col ${STYLE.bodyBackground}`}>
        <SearchContainer
          handleFetchClick={handleFetchClick}
          isEnter={isEnter}
          settingsShow={settingsShow}
          setSettingsShow={setSettingsShow}
          handleQuery={handleQuery}
          query={settingsValues.query}
          refSearch={refSearch}
          currPage={currPage}
          setCurrPage={setCurrPage}
          assetsCount={resp ? resp.nb_results : 0}
          limit={settingsValues.limit.values}
        />
        <div
          id="screen-background"
          className={`fixed top-28 left-0 h-full px-12 py-8 ${
            STYLE.inactiveBackground
          } w-full
                      transition-all duration-300 easy-out  ${
                        settingsShow
                          ? `z-10 blur-none opacity-100 ${STYLE.inactiveBackgroundOpacity}`
                          : `-z-[1] blur-lg opacity-0 md:opacity-0`
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
                      ${STYLE.fontColor} rounded-md w-full
                      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
                      lg:grid-cols-4 gap-4`}
          >
            {resp
              ? resp.files.map((e, ind) => <Card key={`e-${ind}`} e={e} />)
              : null}
          </div>
        </div>
      </main>
    </>
  );
}
