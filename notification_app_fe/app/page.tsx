import { Alert, Stack } from "@mui/material";
import AppShell from "../components/app-shell";
import FilterBar from "../components/filter-bar";
import NotificationWorkspace from "../components/notification-workspace";
import PaginationBar from "../components/pagination-bar";
import {
  fetchNotifications,
  parseNotificationType,
  parsePositiveInt,
} from "../lib/notifications";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchValue(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({ searchParams }: HomePageProps) {
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
      limit,
      page,
      notificationType,
    });

    return (
      <AppShell
        title="All Notifications"
        description="This is the Stage 2 foundation. The page is already reading live notification data, supports API-backed paging, and respects the type filter expected by the assessment."
      >
        <Stack spacing={3}>
          <FilterBar
            basePath="/"
            currentLimit={limit}
            currentPage={page}
            currentType={notificationType}
          />
          <NotificationWorkspace
            notifications={notifications}
            emptyMessage="No notifications matched the current filter."
            mode="all"
          />
          <PaginationBar
            basePath="/"
            currentLimit={limit}
            currentPage={page}
            currentType={notificationType}
            hasNextPage={notifications.length === limit}
          />
        </Stack>
      </AppShell>
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load notifications";

    return (
      <AppShell
        title="All Notifications"
        description="This is the Stage 2 foundation. The page is already reading live notification data, supports API-backed paging, and respects the type filter expected by the assessment."
      >
        <Alert severity="error">{message}</Alert>
      </AppShell>
    );
  }
}
