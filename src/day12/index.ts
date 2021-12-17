import getInput from "../util/getInput";
import path from "path";
import util from "util";

type Node = {
  big: boolean;
  connections: Array<string>;
};

const parseInput = (input: string) => {
  const points: Record<string, Node> = {};

  input
    .trim()
    .split("\n")
    .map((line) => {
      const [a, b] = line.split("-");

      if (!points[a]) {
        points[a] = {
          big: a === a.toUpperCase(),
          connections: [],
        };
      }
      if (!points[b]) {
        points[b] = {
          big: b === b.toUpperCase(),
          connections: [],
        };
      }

      points[a].connections.push(b);
      points[b].connections.push(a);
    });

  return points;
};

const search = (
  nodes: Record<string, Node>,
  start: string,
  visited: Record<string, boolean> = {},
  total: any = 0
): any => {
  visited[start] = true;
  const paths: any = [];

  for (const node of nodes[start].connections) {
    if (node === "end") {
      paths.push({ node });
      total.ends++;
      continue;
    }

    const curNode = nodes[node];
    if (!visited[node] || curNode.big) {
      let nodePaths;
      nodePaths = search(nodes, node, { ...visited }, total);

      if (nodePaths.length) paths.push({ node, next: nodePaths });
    }
  }

  return paths;
};

const part1 = (nodes: Record<string, Node>) => {
  let total = { ends: 0 };
  search(nodes, "start", {}, total);
  return total.ends;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const network = parseInput(data);

  console.log("DAY 12 ---------------");

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(network);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);
};
