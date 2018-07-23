import Option from '@/models/Option';

const fromDate = new Option(
  "Timespan start",
  "time_start",
  "date",
);
const toDate = new Option(
  "Timespan end",
  "time_end",
  "date",
);

export default [
  new Option(
    "last.fm username",
    "username",
    "string",
    "Taurheim",
    undefined,
    true,
  ),
  new Option(
    "Date range",
    "customrange",
    "easydate",
    "Last 3 months",
    undefined,
    true,
    [
      fromDate, toDate
    ]
  ),
  fromDate,
  toDate,
  new Option(
    "Group By",
    "group_by",
    "dropdown",
    "week",
    [
      "week",
      "month",
    ]
  ),
  new Option(
    "Minimum Plays",
    "min_plays",
    "int",
    "10",
  ),
  new Option(
    "Data Set",
    "method",
    "dropdown",
    "artist",
    [
      "artist",
      "album",
      "tag",
    ]
  ),
  new Option(
    "Cache last.fm responses",
    "use_localstorage",
    "toggle",
    true,
  )
]
