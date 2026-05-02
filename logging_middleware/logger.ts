import { Level, PackageName, Stack } from "./types";

const LOG_API = "http://20.207.122.201/evaluation-service/logs";
const MAX_LOG_MESSAGE_LENGTH = 48;
const BACKEND_PACKAGES = new Set<PackageName>([
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
  "auth",
  "config",
  "middleware",
  "utils",
]);
const FRONTEND_PACKAGES = new Set<PackageName>([
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
  "auth",
  "config",
  "middleware",
  "utils",
]);

function isValidPackageForStack(stack: Stack, pkg: PackageName): boolean {
  if (stack === "backend") {
    return BACKEND_PACKAGES.has(pkg);
  }

  return FRONTEND_PACKAGES.has(pkg);
}

function normalizeMessage(message: string): string {
  if (message.length <= MAX_LOG_MESSAGE_LENGTH) {
    return message;
  }

  return message.slice(0, MAX_LOG_MESSAGE_LENGTH);
}

export async function Log(
  stack: Stack,
  level: Level,
  pkg: PackageName,
  message: string
) {
  const token = process.env.ACCESS_TOKEN;

  if (!isValidPackageForStack(stack, pkg)) {
    throw new Error(`Package "${pkg}" is not valid for stack "${stack}"`);
  }

  if (!token) {
    throw new Error("Missing ACCESS_TOKEN");
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
      message: normalizeMessage(message),
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(`Logging failed: ${res.status} ${JSON.stringify(data)}`);
  }

  return data;
}
