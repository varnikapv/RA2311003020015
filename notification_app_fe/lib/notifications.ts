export const NOTIFICATIONS_API_URL =
  "http://20.207.122.201/evaluation-service/notifications";

export const NOTIFICATION_TYPES = [
  "All",
  "Event",
  "Result",
  "Placement",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
export type ApiNotificationType = Exclude<NotificationType, "All">;

export type NotificationItem = {
  ID: string;
  Type: ApiNotificationType;
  Message: string;
  Timestamp: string;
};

export type NotificationsResponse = {
  notifications: NotificationItem[];
};

export type NotificationQuery = {
  limit?: number;
  page?: number;
  notificationType?: NotificationType;
};

export type PriorityNotification = NotificationItem & {
  priorityScore: number;
  typeWeight: number;
  timestampMs: number;
};

export function getAccessToken(): string {
  const token = process.env.ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing ACCESS_TOKEN environment variable");
  }

  return token;
}

export function parsePositiveInt(
  value: string | undefined,
  fallback: number
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function parseNotificationType(
  value: string | undefined
): NotificationType {
  if (!value) {
    return "All";
  }

  const normalized = value.trim();

  if (normalized === "Event" || normalized === "Result" || normalized === "Placement") {
    return normalized;
  }

  return "All";
}

export function buildNotificationQuery({
  limit,
  page,
  notificationType,
}: NotificationQuery): string {
  const params = new URLSearchParams();

  if (limit) {
    params.set("limit", String(limit));
  }

  if (page) {
    params.set("page", String(page));
  }

  if (notificationType && notificationType !== "All") {
    params.set("notification_type", notificationType);
  }

  return params.toString();
}

export async function fetchNotifications(
  query: NotificationQuery = {}
): Promise<NotificationItem[]> {
  const token = getAccessToken();
  const queryString = buildNotificationQuery(query);
  const requestUrl = queryString
    ? `${NOTIFICATIONS_API_URL}?${queryString}`
    : NOTIFICATIONS_API_URL;

  const response = await fetch(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as
    | Partial<NotificationsResponse>
    | null;

  if (!response.ok) {
    throw new Error(`Notifications API failed with status ${response.status}`);
  }

  if (!data || !Array.isArray(data.notifications)) {
    throw new Error("Notifications API returned an invalid payload");
  }

  return data.notifications as NotificationItem[];
}

