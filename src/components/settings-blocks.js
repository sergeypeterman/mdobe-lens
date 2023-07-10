export function SettingsBlock({ type, settingsValues, setSettingsValues }) {
  //component for a group which
  //chooses from a group of options (radio\checkbox type)
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
    <div className="bg-gray-100 px-4 py-1 m-1 rounded-lg shadow-sm ">
      <fieldset className="">
        <legend className="font-bold text-lg px-5 pb-2 basis-full">
          {thisSetting.caption}
        </legend>

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

              <label htmlFor={`${item.name}`} className="px-2 py-1 capitalize">
                {item.title}
              </label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
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
    <div className="bg-gray-100 px-4 py-1 m-1 rounded-lg shadow-sm flex flex-wrap justify-between">
      <div className="font-bold text-lg px-5 pb-2 basis-full">
        {thisSetting.caption}
      </div>
      <input
        className="px-5 mb-2 basis-full"
        type="number"
        id={`${thisSetting}`}
        onChange={handleFieldChange}
        value={thisSetting.values <= 0 ? "" : thisSetting.values}
      />
    </div>
  );
}

export function SettingsButtonsBlock({
  type,
  settingsValues,
  setSettingsValues,
}) {
  let thisSetting = settingsValues[type];

  const handleBlockChange = (e) => {
    let newSet = JSON.parse(JSON.stringify(settingsValues));
    let num = +e.target.value;
    /* switch (thisSetting.type) {
        case "radio":
          newSet[type].selected = num;
          break;
        case "checkbox":
          newSet[type].selected[num] = !newSet[type].selected[num];
          break;
      } */
    setSettingsValues(newSet);
  };

  return (
    <div className="bg-gray-100 px-4 py-1 m-1 rounded-lg shadow-lg flex flex-wrap justify-between">
      <div className="font-bold text-lg px-5 basis-full">
        {thisSetting.caption}
      </div>

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
          <button
            key={`${thisSetting.name}-${item.name}`}
            className="bg-gray-200 m-1 py-2 justify-center flex basis-24
                         rounded-lg border-2"
          >
            {item.title}
          </button>
        );
      })}
    </div>
  );
}
