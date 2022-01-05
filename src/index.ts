import fs from "fs";

const dayReg = /day(\d+)/;

const days: Record<string, Function> = {};
const fns = fs
  .readdirSync(__dirname)
  .filter((path) => path.startsWith("day"))
  .sort((a, b) =>
    parseInt(a.match(dayReg)?.[1] || "0") >
    parseInt(b.match(dayReg)?.[1] || "0")
      ? 1
      : -1
  )
  .map((path) => {
    const fn = require("./" + path).default;
    days[path] = fn;
    return fn;
  });

if (!process.argv[2]) {
  throw new Error("You need to pass a day");
}

let day;
try {
  console.log("Doing day", process.argv[2]);
  day = days["day" + process.argv[2]];
} catch (e) {
  console.error("Invalid day. Requires num from", 1, "to", days.length);
  process.exit();
}

day();
