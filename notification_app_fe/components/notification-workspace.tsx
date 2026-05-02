"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Drawer,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type {
  NotificationItem,
  PriorityNotification,
} from "../lib/notifications";

type NotificationWorkspaceProps = {
  notifications: NotificationItem[] | PriorityNotification[];
  emptyMessage: string;
  mode: "all" | "priority";
};

function getTypeAccent(type: NotificationItem["Type"]): string {
  if (type === "Placement") return "#0f766e";
  if (type === "Result") return "#b35c2e";
  return "#5f3dc4";
}

function isPriorityNotification(
  notification: NotificationItem | PriorityNotification
): notification is PriorityNotification {
  return "priorityScore" in notification;
}

export default function NotificationWorkspace({
  notifications,
  emptyMessage,
  mode,
}: NotificationWorkspaceProps) {
  const [selectedNotification, setSelectedNotification] = useState<
    NotificationItem | PriorityNotification | null
  >(null);

  function handleOpen(notification: NotificationItem | PriorityNotification) {
    setSelectedNotification(notification);
  }

  if (notifications.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid rgba(19, 28, 35, 0.08)",
        }}
      >
        <CardContent>
          <Typography variant="body1" sx={{ color: "#5b6973" }}>
            {emptyMessage}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Grid container spacing={2.5}>
        {notifications.map((notification) => {
          const accent = getTypeAccent(notification.Type);

          return (
            <Grid key={notification.ID} size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  border: `1px solid ${accent}55`,
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  transition: "transform 160ms ease, box-shadow 160ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 14px 32px rgba(19, 28, 35, 0.08)",
                  },
                }}
              >
                <CardContent>
                  <Stack spacing={2.5}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <Typography
                          variant="overline"
                          sx={{ color: accent, fontWeight: 700 }}
                        >
                          {notification.Type}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: "#63727b" }}>
                        {notification.Timestamp}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{ color: "#13222b", fontWeight: 600 }}
                    >
                      {notification.Message}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#63727b",
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                      }}
                    >
                      {notification.ID}
                    </Typography>

                    {isPriorityNotification(notification) ? (
                      <Typography variant="body2" sx={{ color: "#63727b" }}>
                        Weight {notification.typeWeight} • Score {notification.priorityScore}
                      </Typography>
                    ) : null}

                    <Button
                      variant="contained"
                      onClick={() => handleOpen(notification)}
                      sx={{
                        alignSelf: "flex-start",
                        borderRadius: 1.5,
                        bgcolor: "#13222b",
                      }}
                    >
                      View Details
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Drawer
        anchor="right"
        open={selectedNotification !== null}
        onClose={() => setSelectedNotification(null)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 420 },
              p: 3,
            },
          },
        }}
      >
        {selectedNotification ? (
          <Stack spacing={2.5}>
            <Stack spacing={1}>
              <Typography variant="overline" sx={{ color: "#b35c2e" }}>
                Notification Details
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#13222b" }}>
                {selectedNotification.Message}
              </Typography>
            </Stack>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip label={selectedNotification.Type} sx={{ borderRadius: 1.5 }} />
            </Box>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="body2" sx={{ color: "#5b6973" }}>
                Notification ID
              </Typography>
              <Typography sx={{ fontFamily: "monospace", wordBreak: "break-all" }}>
                {selectedNotification.ID}
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="body2" sx={{ color: "#5b6973" }}>
                Timestamp
              </Typography>
              <Typography>{selectedNotification.Timestamp}</Typography>
            </Stack>

            {isPriorityNotification(selectedNotification) ? (
              <Stack spacing={1.5}>
                <Typography variant="body2" sx={{ color: "#5b6973" }}>
                  Priority Details
                </Typography>
                <Typography>Type weight: {selectedNotification.typeWeight}</Typography>
                <Typography>
                  Priority score: {selectedNotification.priorityScore}
                </Typography>
              </Stack>
            ) : null}

            <Box>
              <Button
                variant="outlined"
                onClick={() => setSelectedNotification(null)}
                sx={{ borderRadius: 1.5 }}
              >
                Close
              </Button>
            </Box>
          </Stack>
        ) : null}
      </Drawer>
    </>
  );
}
