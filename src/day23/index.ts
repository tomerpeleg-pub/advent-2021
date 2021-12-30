import getInput from "../util/getInput";
import path from "path";
import util from "util";

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;

// type Amphipod = "A" | "B" | "C" | "D";
enum Amphipod {
  A = 0,
  B = 1,
  C = 2,
  D = 3,
}

const AmphipodTypes: Record<string, Amphipod> = {
  A: Amphipod.A,
  B: Amphipod.B,
  C: Amphipod.C,
  D: Amphipod.D,
};

const energies: Record<Amphipod, number> = {
  [Amphipod.A]: 1,
  [Amphipod.B]: 10,
  [Amphipod.C]: 100,
  [Amphipod.D]: 1000,
};

type Node = {
  neighbours: Node[];
  hallway: boolean;
  home: false | Amphipod;
};

type Amph = {
  type: Amphipod;
  node: Node;
};

const parseInput = (input: string) => {
  /**
   * #############
     #...........#
     ###x#x#x#x###
       #x#x#x#x#
       #########
   */

  // Convert input to a grid of Nodes
  const grid: Node[][] = input
    .split("\n")
    .filter((line) => Boolean(line.trim()))
    .map((line) =>
      line
        .split("")
        .filter((char) => char !== "\r")
        .map((char) => ({
          neighbours: [],
          hallway: char === ".",
          home: AmphipodTypes[char] ?? false,
        }))
    );

  const nodes: Node[] = [];
  const amphipods: Amph[] = [];

  // Loop through grid
  for (let y = 0; y < grid.length; y++) {
    const line = grid[y];
    let curHome = 0;

    for (let x = 0; x < line.length; x++) {
      const node = line[x];

      // Ignore walls and empties
      if (!node.hallway && !node.home) continue;

      // Attach neighbours to each node, and ignore walls/empties
      node.neighbours = [
        grid?.[y - 1]?.[x], // N
        grid?.[y + 1]?.[x], // S
        grid?.[y]?.[x - 1], // W
        grid?.[y]?.[x + 1], // E
      ]
        .filter(Boolean)
        .filter((node) => node.hallway || typeof node.home === "number");

      // If it's a home node, assign it and store the starting pos of the node that's there
      if (node.home) {
        const type = node.home;
        node.home = curHome;
        amphipods.push({ type: type, node });
        curHome++;
      }

      nodes.push(node);
    }
  }

  return {
    nodes,
    amphipods,
  };
};

const isDone = (amphipods: Amph[]) => {
  for (const amphipod of amphipods)
    if (amphipod.node.home !== amphipod.type) return false;

  return true;
};

const search = ({ nodes, amphipods }: { nodes: Node[]; amphipods: Amph[] }) => {
  const queue = Array.from(amphipods);

  while (queue.length > 0) {}
};

const part1 = ({ nodes, amphipods }: { nodes: Node[]; amphipods: Amph[] }) => {
  console.log("start", amphipods);
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./example"));
  const input = parseInput(data);

  console.log("DAY 23 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(input);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);
};
