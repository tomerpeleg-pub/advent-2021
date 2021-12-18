import fs from "fs";

import day1 from "./day1";
import day2 from "./day2";
import day3 from "./day3";
import day4 from "./day4";
import day5 from "./day5";
import day6 from "./day6";
import day7 from "./day7";
import day8 from "./day8";
import day9 from "./day9";
import day10 from "./day10";
import day11 from "./day11";
import day12 from "./day12";
import day13 from "./day13";
import day14 from "./day14";

const dayReg = /day(\d+)/;
const days = fs
  .readdirSync(__dirname)
  .filter((path) => path.startsWith("day"))
  .sort((a, b) =>
    parseInt(a.match(dayReg)?.[1] || "0") >
    parseInt(b.match(dayReg)?.[1] || "0")
      ? 1
      : -1
  )
  .map((path) => require("./" + path).default);

if (!process.argv[2]) {
  throw new Error("You need to pass a day");
}

let day;
try {
  console.log("Doing day", process.argv[2]);
  day = days[parseInt(process.argv[2]) - 1];
} catch (e) {
  console.error("Invalid day. Requires num from", 1, "to", days.length);
  process.exit();
}

day();
