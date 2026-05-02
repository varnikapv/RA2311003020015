import { Log } from "../logging_middleware";

const NOTIFICATIONS_API =
  "http://20.207.122.201/evaluation-service/notifications";
const TOP_NOTIFICATION_LIMIT = 10;
const TYPE_WEIGHT_MULTIPLIER = 1e13;

type NotificationType = "Placement" | "Result" | "Event" | string;

type CampusNotification = {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
};

type ScoredNotification = CampusNotification & {
  priorityScore: number;
  typeWeight: number;
  timestampMs: number;
};

type NotificationsResponse = {
  notifications?: CampusNotification[];
};

async function logStageEvent(
  level: "debug" | "info" | "warn" | "error" | "fatal",
  message: string
): Promise<void> {
  try {
    await Log("backend", level, "service", message);
  } catch (error) {
    const logError = error instanceof Error ? error.message : "Unknown error";
    process.stderr.write(`Logging middleware failed: ${logError}\n`);
  }
}

function getToken(): string {
  const token = process.env.ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing ACCESS_TOKEN environment variable");
  }

  return token;
}

function getTypeWeight(type: NotificationType): number {
  if (type === "Placement") return 3;
  if (type === "Result") return 2;
  return 1;
}

function parseTimestamp(timestamp: string): number {
  const normalizedTimestamp = timestamp.includes(" ")
    ? timestamp.replace(" ", "T")
    : timestamp;
  const time = new Date(normalizedTimestamp).getTime();

  if (Number.isNaN(time)) {
    throw new Error(`Invalid notification timestamp: ${timestamp}`);
  }

  return time;
}

function scoreNotification(
  notification: CampusNotification
): ScoredNotification {
  const typeWeight = getTypeWeight(notification.Type);
  const timestampMs = parseTimestamp(notification.Timestamp);

  return {
    ...notification,
    typeWeight,
    timestampMs,
    priorityScore: typeWeight * TYPE_WEIGHT_MULTIPLIER + timestampMs,
  };
}

function compareScoredNotifications(
  left: ScoredNotification,
  right: ScoredNotification
): number {
  return left.priorityScore - right.priorityScore;
}

class MinHeap {
  private readonly items: ScoredNotification[] = [];

  size(): number {
    return this.items.length;
  }

  peek(): ScoredNotification | undefined {
    return this.items[0];
  }

  push(notification: ScoredNotification): void {
    this.items.push(notification);
    this.bubbleUp(this.items.length - 1);
  }

  replaceRoot(notification: ScoredNotification): void {
    this.items[0] = notification;
    this.bubbleDown(0);
  }

  toSortedDescending(): ScoredNotification[] {
    return [...this.items].sort(
      (left, right) => right.priorityScore - left.priorityScore
    );
  }

  private bubbleUp(index: number): void {
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      const current = this.items[currentIndex];
      const parent = this.items[parentIndex];

      if (compareScoredNotifications(current, parent) >= 0) break;

      this.items[currentIndex] = parent;
      this.items[parentIndex] = current;
      currentIndex = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    let currentIndex = index;

    while (true) {
      const leftChildIndex = currentIndex * 2 + 1;
      const rightChildIndex = currentIndex * 2 + 2;
      let smallestIndex = currentIndex;

      if (
        leftChildIndex < this.items.length &&
        compareScoredNotifications(
          this.items[leftChildIndex],
          this.items[smallestIndex]
        ) < 0
      ) {
        smallestIndex = leftChildIndex;
      }

      if (
        rightChildIndex < this.items.length &&
        compareScoredNotifications(
          this.items[rightChildIndex],
          this.items[smallestIndex]
        ) < 0
      ) {
        smallestIndex = rightChildIndex;
      }

      if (smallestIndex === currentIndex) break;

      const current = this.items[currentIndex];
      this.items[currentIndex] = this.items[smallestIndex];
      this.items[smallestIndex] = current;
      currentIndex = smallestIndex;
    }
  }
}

class TopNotificationTracker {
  private readonly heap = new MinHeap();

  constructor(private readonly limit: number) {}

  add(notification: CampusNotification): void {
    const scoredNotification = scoreNotification(notification);
    const smallestTopNotification = this.heap.peek();

    if (this.heap.size() < this.limit) {
      this.heap.push(scoredNotification);
      return;
    }

    if (
      smallestTopNotification &&
      scoredNotification.priorityScore > smallestTopNotification.priorityScore
    ) {
      this.heap.replaceRoot(scoredNotification);
    }
  }

  addMany(notifications: CampusNotification[]): void {
    for (const notification of notifications) {
      this.add(notification);
    }
  }

  getTopNotifications(): ScoredNotification[] {
    return this.heap.toSortedDescending();
  }
}

async function fetchNotifications(token: string): Promise<CampusNotification[]> {
  await logStageEvent("info", "Fetching notifications from API");

  const response = await fetch(NOTIFICATIONS_API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = (await response.json().catch(() => null)) as
    | NotificationsResponse
    | null;

  if (!response.ok) {
    await logStageEvent(
      "error",
      `Notifications API failed with status ${response.status}`
    );
    throw new Error(`Notifications API failed with status ${response.status}`);
  }

  if (!data || !Array.isArray(data.notifications)) {
    await logStageEvent("error", "Invalid notifications response");
    throw new Error("Invalid notifications response");
  }

  await logStageEvent(
    "info",
    `Fetched ${data.notifications.length} notifications`
  );

  return data.notifications;
}

function formatOutput(notifications: ScoredNotification[]): string {
  const rows = notifications.map((notification, index) => {
    return [
      `${index + 1}. ${notification.Type}`,
      `ID: ${notification.ID}`,
      `Message: ${notification.Message}`,
      `Timestamp: ${notification.Timestamp}`,
      `Weight: ${notification.typeWeight}`,
      `Priority Score: ${notification.priorityScore}`,
    ].join("\n   ");
  });

  return [`Top ${notifications.length} Priority Notifications`, "", ...rows].join(
    "\n\n"
  );
}

async function main(): Promise<void> {
  try {
    const token = getToken();
    const notifications = await fetchNotifications(token);
    const tracker = new TopNotificationTracker(TOP_NOTIFICATION_LIMIT);

    await logStageEvent("debug", "Priority model ready");
    await logStageEvent("info", "Computing top notifications");
    tracker.addMany(notifications);

    const topNotifications = tracker.getTopNotifications();
    await logStageEvent(
      "info",
      `Computed ${topNotifications.length} top priority notifications`
    );

    process.stdout.write(`${formatOutput(topNotifications)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await logStageEvent("error", `Stage 1 failed: ${message}`);
    process.stderr.write(`Stage 1 failed: ${message}\n`);
    process.exitCode = 1;
  }
}

void main();
