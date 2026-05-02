import type {
  NotificationItem,
  PriorityNotification,
} from "./notifications";

const TYPE_WEIGHT_MULTIPLIER = 1e13;

export function getTypeWeight(type: NotificationItem["Type"]): number {
  if (type === "Placement") return 3;
  if (type === "Result") return 2;
  return 1;
}

export function parseTimestamp(timestamp: string): number {
  const normalizedTimestamp = timestamp.includes(" ")
    ? timestamp.replace(" ", "T")
    : timestamp;
  const parsedTimestamp = new Date(normalizedTimestamp).getTime();

  if (Number.isNaN(parsedTimestamp)) {
    throw new Error(`Invalid notification timestamp: ${timestamp}`);
  }

  return parsedTimestamp;
}

export function scoreNotification(
  notification: NotificationItem
): PriorityNotification {
  const typeWeight = getTypeWeight(notification.Type);
  const timestampMs = parseTimestamp(notification.Timestamp);

  return {
    ...notification,
    typeWeight,
    timestampMs,
    priorityScore: typeWeight * TYPE_WEIGHT_MULTIPLIER + timestampMs,
  };
}

export function getTopPriorityNotifications(
  notifications: NotificationItem[],
  limit: number
): PriorityNotification[] {
  return notifications
    .map(scoreNotification)
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .slice(0, limit);
}

