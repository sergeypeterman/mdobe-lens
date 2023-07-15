import { STYLE } from "./constants";

export function SettingsBlock({ type, settingsValues, setSettingsValues }) {
  //component for a group which
  //chooses from a group of options (radio\checkbox type)
  let thisSetting = settingsValues[type];

  const allUnchecked = (setting) => {
    //console.log("all unchecked func");
    if (setting.type === "checkbox") {
      let status = setting.selected.reduce((acc, item) => {
        console.log(`checkbox: ${item}, acc: ${acc}`);
        return !item || acc;
      }, false);
      status && console.log("all unchecked");
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
        /* if (allUnchecked(newSet[type])) {
          console.log("all unchecked");
          newSet[type].selected.forEach((e, ind) => {
            newSet[type].selected[ind] = true;
          });
        } */
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
          //let status = allUnchecked(thisSetting);
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
      </fieldset>
    </div>
  );
}

export function checkIntegerRange(input, min, max) {
  if (Number.isInteger(input)) {
    if (input > max) {
      return { intInRange: false, message: `too large, ${max} max` };
    } else if (input < min) {
      return { intInRange: false, message: `too small, min ${min}` };
    } else {
      return { intInRange: true, message: `correct` };
    }
  } else {
    return { intInRange: false, message: `${input} is not integer` };
  }
}

export function SettingsIntField({ type, settingsValues, setSettingsValues }) {
  //component for a settings group which
  //works with an integer input
  let thisSetting = settingsValues[type];

  const handleFieldChange = (e) => {
    let newSet = JSON.parse(JSON.stringify(settingsValues)); //copy of an abject
    let input = +e.target.value; // convert to num

    newSet[type].values = input;

    setSettingsValues(newSet);
  };

  return (
    <div
      className={`${STYLE.backColor} px-4 py-1 m-1 rounded-sm shadow-sm flex flex-wrap justify-between`}
    >
      <div className="font-bold text-lg px-5 pb-2 basis-full">
        {thisSetting.caption}
      </div>
      <input
        className="min-w-0 px-5 py-1 mb-2 basis-full font-medium text-lg rounded-md"
        type="number"
        id={`${thisSetting}`}
        onChange={handleFieldChange}
        value={thisSetting.values <= 0 ? "" : thisSetting.values}
      />
    </div>
  );
}

export function SettingsOptions({ settingsValues, setSettingsValues }) {}
