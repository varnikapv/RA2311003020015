import { Alert, Stack } from "@mui/material";
import AppShell from "../../components/app-shell";
import FilterBar from "../../components/filter-bar";
import NotificationList from "../../components/notification-list";
import {
  fetchNotifications,
  parseNotificationType,
  parsePositiveInt,
} from "../../lib/notifications";
import { getTopPriorityNotifications } from "../../lib/priority";

type PriorityPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchValue(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PriorityPage({
  searchParams,
}: PriorityPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const limit = parsePositiveInt(
    getSearchValue(resolvedSearchParams.limit),
    10
  );
  const page = parsePositiveInt(getSearchValue(resolvedSearchParams.page), 1);
  const notificationType = parseNotificationType(
    getSearchValue(resolvedSearchParams.notification_type)
  );

  try {
    const notifications = await fetchNotifications({
      limit: Math.max(limit, 20),
      page,
      notificationType,
    });
    const priorityNotifications = getTopPriorityNotifications(
      notifications,
      limit
    );

    return (
      <AppShell
        title="Priority Notifications"
        description="This page uses the Stage 1 scoring model and shows the highest-priority notifications for the current slice of API data."
      >
        <Stack spacing={3}>
          <FilterBar
            basePath="/priority"
            currentLimit={limit}
            currentPage={page}
            currentType={notificationType}
          />
          <NotificationList
            notifications={priorityNotifications}
            emptyMessage="No priority notifications matched the current filter."
          />
        </Stack>
      </AppShell>
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load notifications";

    return (
      <AppShell
        title="Priority Notifications"
        description="This page uses the Stage 1 scoring model and shows the highest-priority notifications for the current slice of API data."
      >
        <Alert severity="error">{message}</Alert>
      </AppShell>
    );
  }
}

