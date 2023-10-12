//variables:
const CONTENT_TYPES = [
  { name: 1, title: "photo", enabled: true },
  { name: 2, title: "illustration", enabled: true },
  { name: 3, title: "vector", enabled: true },
  { name: 4, title: "video", enabled: true },
  { name: 5, title: "UNKNOWN", enabled: false },
  { name: 6, title: "3d", enabled: true },
  { name: 7, title: "template", enabled: true },
];

const ORDER = [
  { name: "relevance", title: "Relevance", enabled: true },
  { name: "creation", title: "Creation", enabled: true },
  { name: "featured", title: "Featured", enabled: true },
  { name: "undiscovered", title: "Undiscovered", enabled: true },
  { name: "nb_downloads", title: "Downloads", enabled: true },
];
const GENTECH = [
  { name: "all", title: "All", enabled: true },
  { name: "true", title: "AI generated", enabled: true },
  { name: "false", title: "non-AI generated", enabled: true },
];
//[age]=1w, 1m, 6m, 1y, 2y, 3y
const AGE = [
  { name: "1w", title: "1 week", enabled: true },
  { name: "1m", title: "1 month", enabled: true },
  { name: "6m", title: "6 months", enabled: true },
  { name: "1y", title: "1 year", enabled: true },
  { name: "2y", title: "2 years", enabled: true },
  { name: "3y", title: "3 years", enabled: true },
  { name: "", title: "any", enabled: true },
];
const RESULT_COLUMNS = [
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

module.exports = { RESULT_COLUMNS, GENTECH, ORDER, AGE, CONTENT_TYPES };
