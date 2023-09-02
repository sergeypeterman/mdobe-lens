import { useCallback, useEffect, useRef, useState } from "react";
import {
  MEDIUM_SCREEN_WIDTH,
  MEDIUM_SCREEN_WIDTHN,
  SETTINGS_TYPES,
  STYLE,
} from "@/components/constants";
import { SettingsContainer, SearchContainer } from "@/components/settings";
import { Card } from "@/components/card";
import Head from "next/head";
const packageJSON = require("package.json");

export default function Home() {
  //main page component

  const [resp, setResp] = useState();
  const [settingsValues, setSettingsValues] = useState(SETTINGS_TYPES); //main settings object
  const [settingsRead, setSettingssRead] = useState(false); //were the settings read from localStorage
  const [currPage, setCurrPage] = useState(1);
  const [settingsErr, setSettingsErr] = useState({
    status: false,
    message: "",
  });
  const [screenSize, setScreenSize] = useState(getScreenSize());

  const refSettings = useRef();
  const refSearch = useRef();

  const [settingsShow, setSettingsShow] = useState(false); //hamburger menu handler

  //getting screen size to hide Cards for small ( < md=768px)
  function getScreenSize() {
    let newScreenSize =
      typeof window === "undefined"
        ? {}
        : {
            width: window.innerWidth,
            height: window.innerHeight,
          };
    return newScreenSize;
  }
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize(getScreenSize());
      console.log("update screen size");
    };
    window.addEventListener("resize", updateScreenSize);
    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, [screenSize]);

  const compareStringify = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  //reading settings from browser cache on the first load
  useEffect(() => {
    //HARD RESET CACHE//localStorage.removeItem(`searchSettings`);
    const mdobeLensVersion = packageJSON.version.split(".");
    const mdobeLensVersionStored = JSON.parse(
      localStorage.getItem(`mdobeLensVersion`)
    );
    const versionStored = mdobeLensVersionStored
      ? mdobeLensVersionStored.split(".")
      : [];

    console.log(
      `package version: ${mdobeLensVersion} stored version: ${versionStored}`
    );
    if (compareStringify(mdobeLensVersion, versionStored)) {
      const localSettings = JSON.parse(localStorage.getItem(`searchSettings`));
      if (localSettings) {
        let sameStructure = compareStringify(
          Object.keys(localSettings),
          Object.keys(SETTINGS_TYPES)
        );

        //console.log(sameStructure, Object.keys(localSettings), Object.keys(SETTINGS_TYPES));
        if (sameStructure) {
          console.log(`reading searchSettings`);
          setSettingsValues(localSettings);
        } else {
          console.log(`removing searchSettings`);
          localStorage.removeItem(`searchSettings`);
          setSettingsValues(SETTINGS_TYPES);
        }
      }
    }
    //add logic for major versions
    else {
      console.log(`removing searchSettings`);
      localStorage.removeItem(`searchSettings`);
      localStorage.setItem(
        `mdobeLensVersion`,
        JSON.stringify(packageJSON.version)
      );
      setSettingsValues(SETTINGS_TYPES);
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

    if (settingsRead && !settingsErr.status) {
      try {
        const res = await fetch(fetchURL);

        console.log(
          `fetch: ${settingsValues.query}, by author ${settingsValues.creatorId.values}`
        );
        console.log(settingsValues);
        if (!res.ok) {
          throw new Error(`Fetch error: ${res.statusText}`);
        }
        const result = await res.json();
        const { response } = result;
        console.log(response);
        setResp(response);
      } catch (err) {
        alert(err.message);
      }
    }
  }, [settingsValues, currPage, settingsRead, settingsErr]);

  //effect checks if the user clicked outside of the open settings menu
  //and fetches with applied settings
  useEffect(() => {
    const checkIfClickedInside = (e) => {
      if (
        settingsShow &&
        screenSize.width < MEDIUM_SCREEN_WIDTH &&
        !refSettings.current.contains(e.target) &&
        !refSearch.current.contains(e.target)
      ) {
        setSettingsShow(false);
        setCurrPage(1);
      }
    };

    handleFetchClick();
    document.addEventListener("mousedown", checkIfClickedInside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedInside);
    };
  }, [settingsShow, handleFetchClick, screenSize]);

  //handling system-wide dark mode changes
  useEffect(() => {
    //console.log(`Theme #${settingsValues.theme.selected}`);
    switch (settingsValues.theme.selected) {
      case 0:
        // Auto
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
          //console.log("matches dark");
        }
        else{
          document.documentElement.classList.remove("dark");
          //console.log("not matches dark");
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

      case 1:
        // Dark
        document.documentElement.classList.add("dark");
        break;

      case 2:
        document.documentElement.classList.remove("dark");
        break;
    }
  }, [settingsValues.theme.selected]);

  const isEnter = (e) => {
    if (e.key === "Enter") {
      handleFetchClick();
      setCurrPage(1);
      return true;
    }
    return false;
  };

  return (
    <>
      <Head>
        <title>mdobeLens</title>
      </Head>
      <main
        className={`min-h-screen min-w-[240px] border-box ${STYLE.bodyBackground}`}
      >
        <div
          id="top-background"
          className={`w-full h-10 bg-neutral-700 flex z-30 justify-center items-center`}
        >
          <h1 className={`text-gray-300 font-medium font-logo z-30`}>
            mdobeLens
          </h1>
        </div>
        <div id="search" className="w-full h-full sticky top-0 z-30">
          <SearchContainer
            handleFetchClick={handleFetchClick}
            isEnter={isEnter}
            settingsShow={settingsShow}
            setSettingsShow={setSettingsShow}
            settingsValues={settingsValues}
            setSettingsValues={setSettingsValues}
            refSearch={refSearch}
            currPage={currPage}
            setCurrPage={setCurrPage}
            assetsCount={resp ? resp.nb_results : 0}
            limit={settingsValues.limit.values}
            screenSize={screenSize}
          />
        </div>
        <div id="settings" className="flex flex-row z-20">
          {settingsShow && screenSize.width < 768 && (
            <div
              id="screen-background"
              className={`fixed top-0 ${STYLE.inactiveBackground} w-full h-full
                    transition-all duration-300 easy-out  ${
                      settingsShow
                        ? `z-10 blur-none opacity-100 ${STYLE.inactiveBackgroundOpacity}`
                        : `-z-[1] blur-lg opacity-0 md:opacity-0`
                    }`}
            ></div>
          )}
          {settingsShow && (
            <div
              id="settings-div"
              className="sticky top-[5.5rem] h-full w-full md:w-[500px] z-20"
            >
              <SettingsContainer
                settingsShow={settingsShow}
                refSettings={refSettings}
                settingsValues={settingsValues}
                setSettingsValues={setSettingsValues}
                settingsErr={settingsErr}
                setSettingsErr={setSettingsErr}
              />
            </div>
          )}
          {!(settingsShow && screenSize.width < 768) && (
            <div
              id="cards-div"
              className={`flex ${settingsShow ? "w-0 md:w-full" : "w-full"}`}
            >
              <div
                className={`text-center p-2 
                      ${STYLE.fontColor} rounded-md w-full
                      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
                      lg:grid-cols-4 gap-4`}
              >
                {resp
                  ? resp.files.map((e, ind) => (
                      <Card
                        key={`e-${e.nb_results}-${e.id}`}
                        e={e}
                        settingsValues={settingsValues}
                      />
                    ))
                  : null}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
