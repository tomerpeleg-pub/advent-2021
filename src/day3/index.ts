import getInput from "../util/getInput";
import path from "path";

export const part1 = (lines: Array<string>): any => {
  const totals: Array<number> = new Array<number>(lines[0].length).fill(0);
  lines.forEach((line) =>
    line.split("").forEach((n: string, i: number) => {
      totals[i] += parseInt(n);
    })
  );

  const gamma = parseInt(
    totals.map((n) => (n > lines.length / 2 ? "1" : "0")).join(""),
    2
  );
  const epsilon = parseInt(
    totals.map((n) => (n <= lines.length / 2 ? "1" : "0")).join(""),
    2
  );
  return gamma * epsilon;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const lines: Array<string> = data.split("\n");

  if (!lines.length) throw new Error("Invalid input, no numbers");

  console.log("DAY 3 ---------------");
  const p1Result = part1(lines);
  console.log("P1 Result: ", p1Result);
};
