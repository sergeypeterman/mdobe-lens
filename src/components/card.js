import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { CONTENT_TYPES } from "@/components/constants";

export function Card({ e }) {
  //Asset card component
  const [pressed, setPressed] = useState(false);

  const handleExpand = () => {
    setPressed(!pressed);
  };

  return (
    <div
      className="mb-2 bg-gradient-to-b w-full flex flex-col rounded-lg shadow-sm
                   from-neutral-100 from-85% to-neutral-50
                   "
    >
      <div className="text-sm flex justify-between p-1">
        <span className="px-1 font-bold">{e.nb_downloads}</span>
        <span>{`${e.creator_name} | ${e.creator_id}`}</span>
        <span title={CONTENT_TYPES[e.media_type_id - 1].title} className="px-1">
          <FontAwesomeIcon icon={CONTENT_TYPES[e.media_type_id - 1].icon} />
        </span>
      </div>
      {CONTENT_TYPES[e.media_type_id - 1].title === "video" ? (
        <video controls>
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
      )}
      <div className="text-sm flex justify-around p-1">
        <span className="px-1">{`id: ${e.id}`}</span>
        <span className="px-1">{e.creation_date.substr(0, 7)}</span>
      </div>
      {pressed ? (
        <div className={`px-3 py-2`}>
          <p className="p-1 border-b-2">{e.title}</p>
          <p className="p-1">
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
