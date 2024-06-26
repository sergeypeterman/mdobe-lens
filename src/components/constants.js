import {
  faPenNib,
  faCamera,
  faVideo,
  faDesktop,
  faCube,
  faPenSquare,
  faCircleChevronDown,
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
export const GENTECH = [
  { name: "all", title: "All", enabled: true },
  { name: "true", title: "AI generated", enabled: true },
  { name: "false", title: "non-AI generated", enabled: true },
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

export const THEME = [
  { name: "auto", title: "Auto", enabled: true },
  { name: "dark", title: "Dark", enabled: true },
  { name: "light", title: "Light", enabled: true },
];

export const EXPANDCARD = [
  {
    name: "expandCards",
    icon: faCircleChevronDown,
    title: "expand all cards",
    enabled: true,
  },
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
    any: true,
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
    values: 0,
    caption: "Author id:",
    min: 0,
    max: 999999999, // xxx.xxx.xxx
  },
  limit: {
    name: "limit",
    type: "number",
    values: 100,
    caption: "Per page:",
    min: 1,
    max: 100,
  },
  gentech: {
    name: "gentech",
    type: "radio",
    caption: "AI generated:",
    values: GENTECH,
    selected: 0,
  },
  skipFetch: { value: false, reason: "" },
};

export const OPTIONS = {
  expandCards: {
    name: "expandCards",
    caption: "Expand All Cards",
    type: "checkbox",
    values: EXPANDCARD,
    selected: [false],
    any: false,
  },
  theme: {
    name: "theme",
    caption: "Theme:",
    type: "radio",
    values: THEME,
    selected: 0,
  },
};

//implementing dark mode styling
export const STYLE = {
  fontColor:
    "text-gray-950 dark:text-gray-200 disabled:text-gray-300 disabled:dark:text-gray-500",
  fontColorLink: "hover:text-sky-800 dark:hover:text-sky-200 underline",
  backColor: "bg-neutral-100 dark:bg-neutral-600",
  backColor2: "bg-neutral-200 dark:bg-neutral-700",
  backColorHover: "hover:bg-neutral-200 hover:dark:bg-neutral-500",
  bodyBackground: "bg-neutral-200 dark:bg-neutral-950",
  inactiveBackground: "bg-neutral-700 dark:bg-neutral-700",
  inactiveBackgroundOpacity: "md:opacity-20 dark:md:opacity-60",
  gradColorFrom: "from-neutral-100 dark:from-neutral-800",
  gradColorTo: "to-neutral-50 dark:to-[#262626]",
  textError: "text-red-500 dark:text-red-200",
  textOnDarkBackground:
    "transition text-gray-200 disabled:text-gray-500 hover:text-gray-50",
  settingsHeader:
    "transition text-neutral-400 disabled:text-neutral-400 hover:text-neutral-500",
  button: "bg-neutral-200 dark:bg-neutral-700 rounded-xl flex items-center justify-center p-1 m-1 hover:bg-neutral-300 hover:dark:bg-neutral-500",
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
  "details_url",
  "is_gentech",
];

export const MEDIUM_SCREEN_WIDTH = 768;
