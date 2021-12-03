import getInput from "../util/getInput";
import path from "path";

const getBitCounts = (lines: Array<string>): Array<boolean> => {
  const totals: Array<number> = new Array<number>(lines[0].length).fill(0);
  lines.forEach((line: string) =>
    line.split("").forEach((n: string, i: number) => {
      totals[i] += parseInt(n);
    })
  );
  return totals.map((n) => n >= lines.length / 2);
};

export const part1 = (lines: Array<string>): number => {
  const oneMostCommon: Array<boolean> = getBitCounts(lines);

  const gamma = parseInt(oneMostCommon.map((n) => (n ? 1 : 0)).join(""), 2);
  const epsilon = parseInt(oneMostCommon.map((n) => (n ? 0 : 1)).join(""), 2);
  return gamma * epsilon;
};

const filterCommon = (lines: Array<string>, most: boolean = true): string => {
  let passing = [...lines];
  const bitToCount = most ? "1" : "0";

  for (let i = 0; i < lines[0].length; i++) {
    const bitCount = passing.reduce(
      (total, line) => (line[i] === "1" ? total + 1 : total),
      0
    );
    let mostCommon: string;

    if (most) {
      mostCommon = bitCount >= passing.length / 2 ? "1" : "0";
    } else {
      mostCommon = bitCount < passing.length / 2 ? "1" : "0";
    }
    passing = passing.filter((line) => line[i] === mostCommon);

    if (passing.length <= 1) return passing.pop() || "";
  }

  return "";
};

export const part2 = (lines: Array<string>): any => {
  const oxygen = filterCommon(lines, true);
  const co2 = filterCommon(lines, false);
  return parseInt(oxygen, 2) * parseInt(co2, 2);
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const lines: Array<string> = data.split("\n");

  if (!lines.length) throw new Error("Invalid input, no numbers");

  console.log("DAY 3 ---------------");
  const p1Result = part1(lines);
  console.log("P1 Result: ", p1Result);

  const p2Result = part2(lines);
  console.log("P2 Result: ", p2Result);
};
