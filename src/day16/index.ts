import getInput from "../util/getInput";
import path from "path";
import util from "util";

const bright = (str: string) => `\x1b[1m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;

let totalVersions = 0;

enum OP {
  SUM = 0,
  PRODUCT = 1,
  MINIMUM = 2,
  MAXIMUM = 3,
  LITERAL = 4,
  GREATER_THAN = 5,
  LESS_THAN = 6,
  EQUAL = 7,
}

type Packet = {
  typeID: OP;
  version: number;
  subPackets?: Array<Packet>;
  payload: number;
};

type Result = [Packet, string];

const parseHex = (input: string) =>
  input
    .split("")
    .map((n) => parseInt(n, 16).toString(2).padStart(4, "0"))
    .join("");

const parseInput = (input: string) => parseHex(input.trim());

const toDec = (input: string) => parseInt("0" + input, 2);

const parseLiteralPacket = (
  input: string,
  version: number,
  typeID: OP
): Result => {
  let start = 0;
  let finished = false;
  let number = "";

  while (!finished) {
    const part = input.substr(start, 5);
    if (part[0] === "0") finished = true;

    number += part.substr(1, 4);
    start += 5;
  }

  return [
    {
      version,
      typeID,
      payload: toDec(number),
    },
    input.substr(start),
  ];
};

const evalOperator = (typeId: OP, subPackets: Array<Packet>): number => {
  switch (typeId) {
    case OP.SUM:
      return subPackets.reduce((sum, cur) => sum + cur.payload, 0);
    case OP.PRODUCT:
      return subPackets.reduce((product, cur) => product * cur.payload, 1);
    case OP.MINIMUM:
      return subPackets.reduce(
        (min, cur) => (cur.payload < min ? cur.payload : min),
        Infinity
      );
    case OP.MAXIMUM:
      return subPackets.reduce(
        (max, cur) => (cur.payload > max ? cur.payload : max),
        -Infinity
      );
    case OP.GREATER_THAN:
      return subPackets?.[0].payload > subPackets?.[1].payload ? 1 : 0;
    case OP.LESS_THAN:
      return subPackets?.[0].payload < subPackets?.[1].payload ? 1 : 0;
    case OP.EQUAL:
      return subPackets?.[0].payload === subPackets?.[1].payload ? 1 : 0;
  }
};

const parseOperatorsByLength = (
  input: string,
  version: number,
  typeID: OP
): Result => {
  const length = toDec(input.substr(0, 15));
  let subPacketBits = input.substr(15, length);
  const subPackets = [];
  let finished = false;

  while (!finished) {
    const [subPacket, remainder] = parsePacket(subPacketBits);
    subPacketBits = remainder || "";
    if (!subPacketBits.trim()) finished = true;
    subPackets.push(subPacket);
  }

  const payload = evalOperator(typeID, subPackets);
  const remainder = input.substr(15 + length);

  return [{ version, typeID, subPackets, payload }, remainder];
};

const parseOperatorsByNumSubPackets = (
  input: string,
  version: number,
  typeID: OP
): Result => {
  const numSubpackets = toDec(input.substr(0, 11));
  let subPacketBits = input.substr(11);
  const subPackets = [];

  for (let i = 0; i < numSubpackets; i++) {
    const [subPacket, remainder] = parsePacket(subPacketBits);
    subPackets.push(subPacket);
    subPacketBits = remainder || "";
  }

  const payload = evalOperator(typeID, subPackets);

  return [{ version, typeID, subPackets, payload }, subPacketBits];
};

const parsePacket = (input: string): Result => {
  const version = toDec(input.substr(0, 3));
  const typeID = toDec(input.substr(3, 3));

  totalVersions += version;

  if (typeID === OP.LITERAL)
    return parseLiteralPacket(input.substr(6), version, typeID);

  const isLength = input[6] === "0";

  if (isLength) {
    return parseOperatorsByLength(input.substr(7), version, typeID);
  } else {
    return parseOperatorsByNumSubPackets(input.substr(7), version, typeID);
  }
};

const part1 = (input: string) => {
  parsePacket(input);
  return totalVersions;
};

const part2 = (input: string) => {
  const [packet, remainder] = parsePacket(input);
  // console.log("result", util.inspect(packet, false, 100, true));
  return packet.payload;
};

export default async () => {
  const data: string = await getInput(path.join(__dirname, "./input"));
  const input = parseInput(data);

  console.log("DAY 16 ---------------");
  // console.log("input", data);

  console.log("P1 ----------");
  console.time("p1");
  const p1Result = part1(input);
  console.timeEnd("p1");
  console.log("P1 Result: ", p1Result);

  console.log("p2 ----------");
  console.time("p2");
  const p2Result = part2(input);
  console.timeEnd("p2");
  console.log("p2 Result: ", p2Result);
};
