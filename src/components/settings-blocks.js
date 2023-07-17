import { useRef, useState, useEffect, useCallback } from "react";
import { STYLE } from "./constants";
import { checkIntegerRange } from "./functions";

export function SettingsBlock({ type, settingsValues, setSettingsValues }) {
  //component for a group which
  //chooses from a group of options (radio\checkbox type)
  let thisSetting = settingsValues[type];
  const [checkedAny, setCheckedAny] = useState(false);

  const handleAny = () => {
    let newAny = !checkedAny;
    if (newAny) {
      let newSet = JSON.parse(JSON.stringify(settingsValues));
      newSet[type].selected.forEach((e, ind) => {
        newSet[type].selected[ind] = true;
      });
      setSettingsValues(newSet);
    } else {
      let newSet = JSON.parse(JSON.stringify(settingsValues));
      newSet[type].selected.forEach((e, ind) => {
        newSet[type].selected[ind] = false;
      });
      setSettingsValues(newSet);
    }

    setCheckedAny(newAny);
  };

  const allUnchecked = (setting) => {
    if (setting.type === "checkbox") {
      let status = setting.selected.reduce((acc, item, ind) => {
        /*DIAGNOSTIC console.log(
          `${setting.values[ind].title} checkbox: ${item}(${
            setting.values[ind].enabled ? "" : "not "
          }enabled), acc: ${acc}`
        ); */
        if (setting.values[ind].enabled === false) {
          return true && acc;
        }
        return !item && acc;
      }, true);
      return status;
    }
    return false;
  };

  const allChecked = (setting) => {
    if (setting.type === "checkbox") {
      let status = setting.selected.reduce((acc, item, ind) => {
        /*DIAGNOSTIC console.log(
          `${setting.values[ind].title} checkbox: ${item}(${
            setting.values[ind].enabled ? "" : "not "
          }enabled), acc: ${acc}`
        ); */
        if (setting.values[ind].enabled === false) {
          return true && acc;
        }
        return item && acc;
      }, true);
      return status;
    }
    return false;
  };

  const handleBlockChange = (e) => {
    let newSet = JSON.parse(JSON.stringify(settingsValues));
    let num = +e.target.value;
    switch (thisSetting.type) {
      case "radio":
        newSet[type].selected = num;
        break;
      case "checkbox":
        newSet[type].selected[num] = !newSet[type].selected[num];
        if (allUnchecked(newSet[type])) {
          console.log(`${thisSetting.caption} all unchecked`);
          setCheckedAny(true);
        } else if (allChecked(newSet[type])) {
          console.log(`${thisSetting.caption} all checked`);
          setCheckedAny(true);
        } else {
          setCheckedAny(false);
        }
        break;
    }
    setSettingsValues(newSet);
  };

  return (
    <div className={`${STYLE.backColor} px-4 py-1 m-1 rounded-sm shadow-sm`}>
      <fieldset className="flex flex-wrap justify-between">
        <legend className="font-bold text-lg px-2 pb-1 basis-full">
          {thisSetting.caption}
        </legend>

        {thisSetting.values.map((item, ind) => {
          if (!item.enabled) {
            return;
          }

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
            <div
              key={`${item.name}`}
              className={`flex items-center p-1 m-1 rounded-md basis-2/7 flex-grow
                          ${STYLE.backColor2}`}
            >
              <input
                type={thisSetting.type}
                id={`${item.name}`}
                value={`${ind}`}
                name={thisSetting.name}
                onChange={handleBlockChange}
                checked={checked}
              />

              <label
                htmlFor={`${item.name}`}
                className="px-2 py-1 capitalize w-full"
              >
                {item.title}
              </label>
            </div>
          );
        })}
        {thisSetting.any ? (
          <div
            className={`flex items-center p-1 m-1 rounded-md basis-2/7 flex-grow
                          ${STYLE.backColor2}`}
          >
            <input
              type={thisSetting.type}
              id={`Any`}
              value={`${thisSetting.values.length}`}
              name={"Any"}
              onChange={handleAny}
              checked={checkedAny}
            />

            <label htmlFor={`Any`} className="px-2 py-1 capitalize w-full">
              Any
            </label>
          </div>
        ) : null}
      </fieldset>
    </div>
  );
}

export function SettingsIntField({
  type,
  settingsValues,
  setSettingsValues,
  error,
  setError,
}) {
  //component for a settings group which
  //works with an integer input

  let thisSetting = settingsValues[type];
  const thisRef = useRef();
  const [thisInt, setThisInt] = useState(thisSetting.values);

  let thisStyle =
    "min-w-0 px-5 py-1 mb-2 basis-full w-full text-gray-800 font-medium text-lg rounded-md";

  const updateThisInt = (input, isCorrect) => {
    let newSet = JSON.parse(JSON.stringify(settingsValues)); //copy of an object
    let err = JSON.parse(JSON.stringify(error));

    //console.log(Number(input));

    err.status = false;
    if (isCorrect.intInRange) {
      thisRef.current.className = `${thisStyle}`;
      newSet[type].values = input;
      setSettingsValues(newSet);
      setError(err);
    } else {
      thisRef.current.focus();
      thisRef.current.className = `bg-rose-300 ${thisStyle}`;
      err.status = true;
      err.message = isCorrect.message;
      setError(err);
    }
  };

  const handleBlur = (e) => {
    let input = e.target.value === "" ? 0 : e.target.value;
    let isCorrect = checkIntegerRange(
      Number(input),
      thisSetting.min,
      thisSetting.max
    );
    updateThisInt(input, isCorrect);
  };

  const handleFieldChange = (e) => {
    let input = e.target.value === "" ? 0 : e.target.value;
    let isCorrect = checkIntegerRange(
      Number(input),
      thisSetting.min,
      thisSetting.max
    );
    console.log(thisInt);
    updateThisInt(input, isCorrect);
    isCorrect.intInRange && setThisInt(input);
  };

  return (
    <div
      className={`px-4 py-1 flex basis-1/2 flex-wrap justify-between`}
    >
      <div className="font-bold text-lg px-2 pb-1 basis-full">
        {thisSetting.caption}
      </div>
      <input
        className={`${thisStyle}`}
        type="number"
        id={`${thisSetting.name}`}
        onChange={handleFieldChange}
        onBlur={handleBlur}
        value={thisInt}
        ref={thisRef}
        min={thisSetting.min}
        max={thisSetting.max}
      />
    </div>
  );
}

export function SettingsOptions({ settingsValues, setSettingsValues }) {}
