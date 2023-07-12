import {
  faPenNib,
  faCamera,
  faVideo,
  faDesktop,
  faCube,
  faPenSquare,
} from "@fortawesome/free-solid-svg-icons";

export const CONTENT_TYPES = [
  { name: 1, icon: faCamera, title: "photo" },
  { name: 2, icon: faDesktop, title: "illustration" },
  { name: 3, icon: faPenNib, title: "vector" },
  { name: 4, icon: faVideo, title: "video" },
  { name: 5, icon: faCube, title: "3d" },
  { name: 6, icon: faPenSquare, title: "template" },
];

export const ORDER = [
  { name: "relevance", title: "Relevance" },
  { name: "creation", title: "Creation" },
  { name: "featured", title: "Featured" },
  { name: "undiscovered", title: "Undiscovered" },
  { name: "nb_downloads", title: "Downloads" },
];
//[age]=1w, 1m, 6m, 1y, 2y, 3y
export const AGE = [
  { name: "1w", title: "1 week" },
  { name: "1m", title: "1 month" },
  { name: "6m", title: "6 months" },
  { name: "1y", title: "1 year" },
  { name: "2y", title: "2 years" },
  { name: "3y", title: "3 years" },
  { name: "", title: "any" },
];
export const SETTINGS_TYPES = {
  order: {
    name: "order",
    type: "radio",
    caption: "Order by:",
    values: ORDER,
    selected: 0,
  },
  content: {
    name: "media_type_id",
    type: "checkbox",
    caption: "Content types:",
    values: CONTENT_TYPES,
    selected: [true, true, true, true, false, false],
  },
  age: {
    name: "age",
    type: "radio",
    caption: "Uploaded in the last:",
    values: AGE,
    selected: 2,
  },
  query: "",
  creatorId: {
    name: "creator_id",
    type: "number",
    values: -1,
    caption: "Author id:",
  },
  limit: {
    name: "limit",
    type: "number",
    values: 100,
    caption: "Assets per page",
  },
};

//implementing dark mode styling
export const STYLE = {
  fontColor:
    "text-gray-950 dark:text-gray-200 disabled:text-gray-300 disabled:dark:text-gray-500",
  backColor: "bg-neutral-100 dark:bg-neutral-600",
  backColor2: "bg-neutral-200 dark:bg-neutral-700",
  backColorHover: "hover:bg-neutral-200 hover:dark:bg-neutral-500",
  bodyBackground: "bg-neutral-200 dark:bg-neutral-950",
  inactiveBackground: "bg-neutral-800 dark:bg-neutral-800",
  inactiveBackgroundOpacity: "md:opacity-20 dark:md:opacity-60",
  gradColorFrom: "from-neutral-100 dark:from-neutral-800",
  gradColorTo: "to-neutral-50 dark:to-[#262626]",
};
