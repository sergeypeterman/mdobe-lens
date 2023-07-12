import { STYLE } from "./constants";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Paginator({ currPage, setCurrPage, assetsCount, limit }) {
  const updatePage = (num) => {
    let newPage = +num > 0 ? num : currPage;
    //console.log(newPage, num);
    setCurrPage(newPage);
  };

  const handleCurrPage = (e) => {
    updatePage(e.target.value);
  };

  const pagesCount = Math.ceil(+assetsCount / +limit);

  return (
    <div id="pages-container" className="w-2/3 z-20 lg:w-1/2 mt-1">
      <div className={`flex flex-row items-center justify-center `}>
        <div
          className={`text-center font-medium text-lg 
                      ${STYLE.fontColor} px-2 py-1 rounded-l-lg ${STYLE.backColor}`}
        >
          <h1>Page: </h1>
        </div>
        <button
          id="previous-page"
          aria-label="Previous Page"
          onClick={() => updatePage(currPage - 1)}
          disabled={currPage < 2}
          className={` ${STYLE.backColor} ${STYLE.backColorHover} text-center 
                      px-3 py-1 ${STYLE.fontColor} text-lg`}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <input
          id="current-page"
          aria-label="Current Page"
          className={`${STYLE.backColor} ${STYLE.backColorHover} text-center 
                      px-3 py-1 ${STYLE.fontColor} text-lg w-24`}
          type="number"
          disabled={currPage >= pagesCount}
          value={currPage}
          onChange={handleCurrPage}
        />
        <button
          id="next-page"
          aria-label="Next Page"
          onClick={() => updatePage(currPage + 1)}
          disabled={currPage >= pagesCount}
          className={` ${STYLE.backColor} ${STYLE.backColorHover} text-center 
                      px-3 py-1 ${STYLE.fontColor} text-lg`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <div
          className={`text-center font-medium px-2 py-1 rounded-r-lg ${STYLE.backColor}`}
        >
          <h1 className={`text-lg ${STYLE.fontColor}`}>
            <span className={`font-normal ${STYLE.fontColor}`}>of </span>
            {`${pagesCount}`}
          </h1>
        </div>
      </div>
    </div>
  );
}
