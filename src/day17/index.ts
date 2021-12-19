import getInput from "../util/getInput";
import path from "path";
import util from "util";

type Target = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const parseInput = (input: string) => {
  const reg = /target area: x=(-?[0-9]+)..(-?[0-9]+), y=(-?[0-9]+)..(-?[0-9]+)/;
  const result = input.trim().match(reg);
  return {
    x1: parseInt(result?.[1] || ""),
    x2: parseInt(result?.[2] || ""),
    y1: parseInt(result?.[3] || ""),
    y2: parseInt(result?.[4] || ""),
  };
};

const tryLaunch = (
  initialVelocity: { x: number; y: number },
  target: Target
) => {
  let finished = false;
  let velocity = { ...initialVelocity };
  let position = { x: 0, y: 0 };
  let maxY = position.y;

  while (!finished) {
    position.x += velocity.x;
    position.y += velocity.y;

    if (position.y > maxY) maxY = position.y;

    if (
      position.x >= target.x1 &&
      position.x <= target.x2 &&
      position.y >= target.y1 &&
      position.y <= target.y2
    ) {
      // inside target
      return { hit: true, maxY };
    }

    if (
      (position.x < target.x1 && velocity.x <= 0) || // too far left
      (position.x > target.x2 && velocity.x >= 0) || // too far right
      (position.y < target.y2 && position.y < target.y1) // below target
    ) {
      // miss
      return { hit: false, maxY };
    }

    velocity.y--;
    if (velocity.x !== 0)
      velocity.x = velocity.x > 0 ? velocity.x - 1 : velocity.x + 1;
  }

  return { hit: false, maxY: 0 };
};

const part1 = (target: Target) => {
  let maxInitial;
  let curMaxY = -Infinity;

  for (let x = 1; x <= target.x2; x++) {
    for (let y = target.y1; y <= -target.y1; y++) {
      const { hit, maxY } = tryLaunch({ x, y }, target);
      if (hit && maxY > curMaxY) {
        maxInitial = { x, y };
        curMaxY = maxY;
      }
    }
  }

  console.log("result", { curMaxY, maxInitial });
  return curMaxY;
};

const part2 = (target: Target) => {
  const hitInitials = [];

  for (let x = 1; x <= target.x2; x++) {
    for (let y = target.y1; y <= -target.y1; y++) {
      const { hit } = tryLaunch({ x, y }, target);
      if (hit) hitInitials.push({ x, y });
    }
  }

  return hitInitials.length;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const target = parseInput(data);

  console.log("DAY 17 ---------------");
  console.log("Target:", target);

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(target);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("p2 ----------");
  console.time("p2");
  const p2Result = part2(target);
  console.timeEnd("p2");
  console.log("p2 Result: ", p2Result);
};
