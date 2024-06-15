import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faCircleExclamation,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { CONTENT_TYPES, STYLE } from "@/components/constants";
import { ST } from "next/dist/shared/lib/utils";

export function Card({
  e,
  optionsValues,
  showCardDetails,
  setShowCardDetails,
}) {
  //Asset card component
  const [pressed, setPressed] = useState(optionsValues.expandCards.selected[0]);

  let keysArrayLength;
  const handleExpand = () => {
    setPressed(!pressed);
  };

  let dataIsCorrect = true;
  const validateData = () => {
    if (dataIsCorrect === false) {
      return false;
    } else {
      if (CONTENT_TYPES[e.media_type_id - 1] === undefined) {
        dataIsCorrect = false;
        return false;
      } else {
        dataIsCorrect = true;
        return true;
      }
    }
  };

  const getCardContent = () => {
    let cardType;
    validateData();

    keysArrayLength = e.keywords.length;

    if (!dataIsCorrect || CONTENT_TYPES[e.media_type_id - 1] === undefined) {
      cardType = "ERROR";
    } else {
      cardType = CONTENT_TYPES[e.media_type_id - 1].title;
    }
    return cardType === "video" ? (
      <video controls key={e.video_small_preview_url}>
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
    );
  };

  const getCardHeader = () => {
    let cardType;
    let cardIcon;
    validateData();

    if (!dataIsCorrect || CONTENT_TYPES[e.media_type_id - 1] === undefined) {
      cardType = "ERROR";
      cardIcon = faCircleExclamation;
    } else {
      cardType = CONTENT_TYPES[e.media_type_id - 1].title;
      cardIcon = CONTENT_TYPES[e.media_type_id - 1].icon;
    }

    return (
      <div className="text-sm flex justify-between p-1">
        <span className="px-1 font-bold">{e.nb_downloads}</span>
        <span className="truncate">{`${e.creator_id} | ${e.creator_name}`}</span>
        <span className="flex">
          {e.is_gentech ? (
            <span title="AI Generated" className="px-1">
              <FontAwesomeIcon icon={faRobot} />
            </span>
          ) : null}
          <span title={cardType} className="px-1">
            <FontAwesomeIcon icon={cardIcon} />
          </span>
        </span>
      </div>
    );
  };

  const formatKeyword = (keyword, keyIndex) => {
    return keyIndex === keysArrayLength - 1 ? `${keyword}` : `${keyword}, `;
  };

  const openDetailsWindow = () => {
    const newOptions = {
      status: true,
      assetToDisplay: e.id,
    };
    setShowCardDetails(newOptions);
  };

  //<span className="px-1">{String(e.is_gentech)}</span>
  return (
    <div
      className={`w-full flex flex-col rounded-lg shadow-sm justify-between 
        bg-gradient-to-b ${STYLE.gradColorFrom} from-85% ${STYLE.gradColorTo}`}
    >
      <div className="flex flex-col">
        {getCardHeader()}
        {getCardContent()}
        <button className={`${STYLE.button}`} onClick={openDetailsWindow}>
          Details
        </button>
        <div className="text-sm flex justify-around p-1">
          <a
            className={`px-1 ${STYLE.fontColor} ${STYLE.fontColorLink}`}
            href={`${e.details_url}?locale=en_US`}
            title={`Open the asset with id ${e.id} on Adobe Stock`}
          >{`id: ${e.id}`}</a>

          <span className="px-1">{e.creation_date.substr(0, 7)}</span>
        </div>
        {pressed ? (
          <div className={`px-3 py-2`}>
            <p className="p-1 border-b-2 text-start">{e.title}</p>
            <p className="p-1 text-between text-justify">
              {e.keywords.reduce(
                (acc, item, ind) => (acc += formatKeyword(item.name, ind)),
                " "
              )}
            </p>
          </div>
        ) : null}
      </div>
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
