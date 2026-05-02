"use client";

import Link from "next/link";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import {
  NOTIFICATION_TYPES,
  type NotificationType,
} from "../lib/notifications";

type FilterBarProps = {
  basePath: string;
  currentLimit: number;
  currentPage: number;
  currentType: NotificationType;
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

export default function FilterBar({
  basePath,
  currentLimit,
  currentPage,
  currentType,
}: FilterBarProps) {
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
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 1.5,
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {NOTIFICATION_TYPES.map((type) => {
              const selected = type === currentType;

              return (
                <Chip
                  key={type}
                  component={Link}
                  clickable
                  href={buildHref(basePath, currentLimit, 1, type)}
                  label={type}
                  color={selected ? "primary" : "default"}
                  variant={selected ? "filled" : "outlined"}
                  sx={{
                    borderRadius: 1.5,
                    textDecoration: "none",
                    bgcolor: selected ? "#13222b" : "transparent",
                    color: selected ? "#fff" : "#233540",
                    borderColor: "rgba(19, 28, 35, 0.14)",
                  }}
                />
              );
            })}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
