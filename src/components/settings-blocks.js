import { useRef, useState } from "react";
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
        <legend className="font-bold text-lg px-5 pb-2 basis-full">
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

export function SettingsIntField({ type, settingsValues, setSettingsValues }) {
  //component for a settings group which
  //works with an integer input
  let thisSetting = settingsValues[type];
  const [thisInt, setThisInt] = useState(thisSetting.values);
  const [thisErr, setThisErr] = useState({ status: false, message: "" });
  const thisRef = useRef();

  const handleBlur = (e) => {
    let newSet = JSON.parse(JSON.stringify(settingsValues)); //copy of an abject
    let input = e.target.value;

    let isCorrect = checkIntegerRange(Number(input), thisSetting.min, thisSetting.max);
    let err = JSON.parse(JSON.stringify(thisErr));
    
    err.status = false;
    if (isCorrect.intInRange) {
      thisRef.current.className =
        "min-w-0 px-5 py-1 mb-2 basis-full font-medium text-lg rounded-md";
      newSet[type].values = input;
      setSettingsValues(newSet);
      setThisErr(err);
    } else {
      thisRef.current.focus();
      thisRef.current.className =
        "bg-rose-300 min-w-0 px-5 py-1 mb-2 basis-full font-medium text-lg rounded-md";
      err.status = true;
      err.message = isCorrect.message;
      setThisErr(err);
    }
  };

  const handleFieldChange = (e) => {
    let num = e.target.value;
    console.log(num);
    let err = JSON.parse(JSON.stringify(thisErr));

    let isCorrect = checkIntegerRange(Number(num), thisSetting.min, thisSetting.max);

    err.status = false;
    if (isCorrect.intInRange) {
      setThisErr(err);
      setThisInt(num);
    } else {
      console.log(isCorrect.message);
      err.status = true;
      err.message = isCorrect.message;
      setThisErr(err);
    }
  };

  return (
    <div
      className={`${STYLE.backColor} px-4 py-1 m-1 rounded-sm shadow-sm flex flex-wrap justify-between`}
    >
      <div className="font-bold text-lg px-5 pb-2 basis-1/2">
        {thisSetting.caption}
      </div>
      <div className={`${STYLE.textError} px-5 pb-2 basis-1/2 text-right`}>
        {thisErr.status && thisErr.message}
      </div>
      <input
        className="min-w-0 px-5 py-1 mb-2 basis-full font-medium text-lg rounded-md"
        type="number"
        id={`${thisSetting}`}
        onChange={handleFieldChange}
        onBlur={handleBlur}
        value={thisInt ? thisInt : ""}
        ref={thisRef}
      />
    </div>
  );
}

export function SettingsOptions({ settingsValues, setSettingsValues }) {}
