import { Level, PackageName, Stack } from "./types";

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

export async function Log(
  stack: Stack,
  level: Level,
  pkg: PackageName,
  message: string
) {
  const token = process.env.AFFORDMED_TOKEN;

  if (!token) {
    throw new Error("Missing AFFORDMED_TOKEN");
  }

  const res = await fetch(LOG_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      stack,
      level,
      package: pkg,
      message,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(`Logging failed: ${res.status} ${JSON.stringify(data)}`);
  }

  return data;
}
