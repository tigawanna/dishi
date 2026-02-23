export const ansiiColors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
} as const;

export function colorize(color: keyof typeof ansiiColors, text: string) {
  return `${ansiiColors[color]}${text}\x1b[0m`;
}

export const methodColors = {
  GET: "green",
  POST: "blue",
  PUT: "yellow",
  DELETE: "red",
} as const;

export function colorizeMethod(method: keyof typeof methodColors | (string & {})): string {
  switch (method) {
    case "GET":
      return colorize("green", method);
    case "POST":
      return colorize("blue", method);
    case "PUT":
      return colorize("yellow", method);
    case "DELETE":
      return colorize("magenta", method);
    default:
      return colorize("white", method);
  }
}
