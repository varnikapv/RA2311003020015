import Link from "next/link";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import type { NotificationType } from "../lib/notifications";

type PaginationBarProps = {
  basePath: string;
  currentLimit: number;
  currentPage: number;
  currentType: NotificationType;
  hasNextPage: boolean;
};

function buildHref(
  basePath: string,
  limit: number,
  page: number,
  notificationType: NotificationType
): string {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
  });

  if (notificationType !== "All") {
    params.set("notification_type", notificationType);
  }

  return `${basePath}?${params.toString()}`;
}

export default function PaginationBar({
  basePath,
  currentLimit,
  currentPage,
  currentType,
  hasNextPage,
}: PaginationBarProps) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid rgba(19, 28, 35, 0.08)",
        backgroundColor: "rgba(255, 255, 255, 0.82)",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" sx={{ color: "#5b6973" }}>
            Page {currentPage}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              component={Link}
              href={buildHref(
                basePath,
                currentLimit,
                Math.max(1, currentPage - 1),
                currentType
              )}
              disabled={currentPage === 1}
              variant="outlined"
              sx={{ borderRadius: 1.5 }}
            >
              Previous
            </Button>
            <Button
              component={Link}
              href={buildHref(
                basePath,
                currentLimit,
                currentPage + 1,
                currentType
              )}
              disabled={!hasNextPage}
              variant="contained"
              sx={{ borderRadius: 1.5, bgcolor: "#13222b" }}
            >
              Next
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
