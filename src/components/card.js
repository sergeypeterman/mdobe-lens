import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { CONTENT_TYPES, STYLE } from "@/components/constants";

export function Card({ e }) {
  //Asset card component
  const [pressed, setPressed] = useState(false);

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
        <span>{`${e.creator_name} | ${e.creator_id}`}</span>
        <span title={cardType} className="px-1">
          <FontAwesomeIcon icon={cardIcon} />
        </span>
      </div>
    );
  };

  return (
    <div
      className={`mb-2 w-full flex flex-col rounded-lg shadow-sm 
        bg-gradient-to-b ${STYLE.gradColorFrom} from-85% ${STYLE.gradColorTo}`}
    >
      {getCardHeader()}
      {getCardContent()}
      <div className="text-sm flex justify-around p-1">
        <span className="px-1">{`id: ${e.id}`}</span>
        <span className="px-1">{e.creation_date.substr(0, 7)}</span>
      </div>
      {pressed ? (
        <div className={`px-3 py-2`}>
          <p className="p-1 border-b-2 text-start">{e.title}</p>
          <p className="p-1 text-between text-justify">
            {e.keywords.reduce((acc, item) => (acc += `${item.name}, `), " ")}
          </p>
        </div>
      ) : null}
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
