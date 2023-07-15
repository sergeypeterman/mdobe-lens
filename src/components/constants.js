import {
  faPenNib,
  faCamera,
  faVideo,
  faDesktop,
  faCube,
  faPenSquare,
} from "@fortawesome/free-solid-svg-icons";

export const CONTENT_TYPES = [
  { name: 1, icon: faCamera, title: "photo", enabled: true },
  { name: 2, icon: faDesktop, title: "illustration", enabled: true },
  { name: 3, icon: faPenNib, title: "vector", enabled: true },
  { name: 4, icon: faVideo, title: "video", enabled: true },
  { name: 5, icon: null, title: "UNKNOWN", enabled: false },
  { name: 6, icon: faCube, title: "3d", enabled: true },
  { name: 7, icon: faPenSquare, title: "template", enabled: true },
];

export const ORDER = [
  { name: "relevance", title: "Relevance", enabled: true },
  { name: "creation", title: "Creation", enabled: true },
  { name: "featured", title: "Featured", enabled: true },
  { name: "undiscovered", title: "Undiscovered", enabled: true },
  { name: "nb_downloads", title: "Downloads", enabled: true },
];
//[age]=1w, 1m, 6m, 1y, 2y, 3y
export const AGE = [
  { name: "1w", title: "1 week", enabled: true },
  { name: "1m", title: "1 month", enabled: true },
  { name: "6m", title: "6 months", enabled: true },
  { name: "1y", title: "1 year", enabled: true },
  { name: "2y", title: "2 years", enabled: true },
  { name: "3y", title: "3 years", enabled: true },
  { name: "", title: "any", enabled: true },
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
    selected: [true, true, true, true, false, false, false],
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
  inactiveBackground: "bg-neutral-700 dark:bg-neutral-700",
  inactiveBackgroundOpacity: "md:opacity-20 dark:md:opacity-60",
  gradColorFrom: "from-neutral-100 dark:from-neutral-800",
  gradColorTo: "to-neutral-50 dark:to-[#262626]",
};

export const RESULT_COLUMNS = [
  "id",
  "thumbnail_url",
  "thumbnail_width",
  "thumbnail_height",
  "nb_downloads",
  "creation_date",
  "country_name",
  "creator_name",
  "creator_id",
  "width",
  "height",
  "has_releases",
  "keywords",
  "title",
  "media_type_id",
  "premium_level_id",
  "video_small_preview_url",
  "video_small_preview_width",
  "video_small_preview_height",
  "video_small_preview_content_length",
  "video_small_preview_content_type",
  "nb_results",
  "is_gentech",
];
