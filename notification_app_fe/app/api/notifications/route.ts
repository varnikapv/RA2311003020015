import { NextRequest, NextResponse } from "next/server";
import {
  fetchNotifications,
  parseNotificationType,
  parsePositiveInt,
} from "../../../lib/notifications";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const notifications = await fetchNotifications({
      limit: parsePositiveInt(searchParams.get("limit") ?? undefined, 10),
      page: parsePositiveInt(searchParams.get("page") ?? undefined, 1),
      notificationType: parseNotificationType(
        searchParams.get("notification_type") ?? undefined
      ),
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch notifications";

    return NextResponse.json({ message }, { status: 500 });
  }
}

