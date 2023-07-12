import { STYLE } from "./constants";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Paginator({ currPage, setCurrPage, assetsCount, limit }) {
  const updatePage = (num) => {
    let newPage = +num > 0 ? num : currPage;
    setCurrPage(newPage);
  };

  const handleCurrPage = (e) => {
    updatePage(e.target.value);
  };

  const pagesCount = Math.ceil(+assetsCount / +limit);

  let textStyle = `transition text-gray-200 disabled:text-gray-500 hover:text-gray-50`;

  return (
    <div id="pages-container" className="w-full z-20 lg:w-1/2 mt-2">
      <div className={`flex flex-row items-center justify-center `}>
        <button
          className={`hover:underline ${textStyle} px-3`}
          onClick={() => updatePage(1)}
        >{`${1}`}</button>
        <button
          id="previous-page"
          aria-label="Previous Page"
          onClick={() => updatePage(currPage - 1)}
          disabled={currPage < 2}
          className={` bg-transparent text-center ${textStyle} 
                       px-3 py-1 text-lg rounded-l-lg `}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <input
          id="current-page"
          aria-label="Current Page"
          className={`bg-transparent text-center font-medium
                      px-3 py-1  ${textStyle} text-lg `}
          type="number"
          disabled={currPage > pagesCount}
          value={currPage}
          min={1}
          max={pagesCount + 1}
          onChange={handleCurrPage}
        />
        <button
          id="next-page"
          aria-label="Next Page"
          onClick={() => updatePage(currPage + 1)}
          disabled={currPage >= pagesCount}
          className={` bg-transparent text-center 
                      px-3 py-1  ${textStyle} text-lg rounded-r-lg`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <button
          className={`${textStyle} hover:underline px-3`}
          onClick={() => updatePage(pagesCount)}
        >{`${pagesCount}`}</button>
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
