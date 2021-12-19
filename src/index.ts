import fs from "fs";

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
