import { STYLE } from "./constants";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { checkIntegerRange } from "./functions";
import { useRef, useState } from "react";

export function Paginator({ currPage, setCurrPage, assetsCount, limit }) {
  const [err, setErr] = useState(false);
  const ref = useRef();

  const pagesCount = Math.ceil(+assetsCount / +limit);

  const updatePage = (num) => {
    let newPage = num > 0 ? num : currPage;
    setCurrPage(newPage);
  };

  const handleCurrPage = (e) => {
    let input = e.target.value;
    let isCorrect = checkIntegerRange(Number(input), 1, pagesCount);

    let error = false;
    if (isCorrect.intInRange) {
      ref.current.className = `bg-transparent text-center font-medium
      px-3 py-1  ${textStyle} text-lg `;
      setErr(error);
      updatePage(Number(input));
    } else {
      ref.current.className = `bg-red-500 text-center font-medium
      px-3 py-1  ${textStyle} text-lg border-red-500`;
      error = true;
      setErr(error);
    }
  };

  const handleBlur = (e) => {
    let input = e.target.value;
    let isCorrect = checkIntegerRange(Number(input), 1, pagesCount);

    let error = false;
    if (isCorrect.intInRange) {
      ref.current.className = `bg-transparent text-center font-medium
      px-3 py-1  ${textStyle} text-lg `;
      setErr(error);
      updatePage(Number(input));
    } else {
      ref.current.focus();
      ref.current.className = `bg-transparent text-center font-medium
      px-3 py-1  ${textStyle} text-lg border-red-500`;
      error = true;
      setErr(error);
    }
  };

  const textStyle = STYLE.textOnDarkBackground;

  return (
    <div
      id="pages-container"
      className="w-full p-1 bg-neutral-700 shadow-md z-30"
    >
      <div className={`flex  flex-row items-center justify-center `}>
        <button
          className={`hover:underline flex-1 ${textStyle} px-3`}
          title="First Page"
          onClick={() => updatePage(1)}
          disabled={currPage === 1}
        >{`1`}</button>
        <button
          id="previous-page"
          onClick={() => updatePage(currPage - 1)}
          disabled={currPage < 2}
          title="Previous Page"
          className={` bg-transparent text-center ${textStyle} 
                       px-3 py-1 text-lg rounded-l-lg `}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <input
          id="current-page"
          aria-label="Current Page"
          ref={ref}
          className={`bg-transparent text-center font-medium
                      px-3 py-1  ${textStyle} text-lg `}
          type="number"
          disabled={currPage > pagesCount}
          value={currPage}
          min={1}
          max={pagesCount + 1}
          onChange={handleCurrPage}
          onBlur={handleBlur}
        />
        <button
          id="next-page"
          title="Next Page"
          onClick={() => updatePage(currPage + 1)}
          disabled={currPage >= pagesCount}
          className={` bg-transparent text-center 
                      px-3 py-1  ${textStyle} text-lg rounded-r-lg`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <button
          className={`${textStyle} flex-1 hover:underline px-3`}
          onClick={() => updatePage(pagesCount + 1)}
          title="Last Page"
          disabled={currPage === pagesCount}
        >{`${pagesCount + 1}`}</button>
      </div>
    </div>
  );
}
/* 
<div
          className={`text-center font-medium px-2 py-1 text-center font-medium px-2 py-1 bg-transparent`}
        >
          <h1
            className={`cursor-pointer hover:underline ${textStyle}`}
            onClick={updatePage(pagesCount)}
          >{`${pagesCount}`}</h1>
        </div> */
