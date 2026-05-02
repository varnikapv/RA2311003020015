import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import type { NotificationItem } from "../lib/notifications";

type NotificationListProps = {
  notifications: NotificationItem[];
  emptyMessage: string;
};

function getTypeAccent(type: NotificationItem["Type"]): string {
  if (type === "Placement") return "#0f766e";
  if (type === "Result") return "#b35c2e";
  return "#5f3dc4";
}

export default function NotificationList({
  notifications,
  emptyMessage,
}: NotificationListProps) {
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
                border: "1px solid rgba(19, 28, 35, 0.08)",
                backgroundColor: "rgba(255, 255, 255, 0.92)",
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Chip
                      label={notification.Type}
                      size="small"
                      sx={{
                        bgcolor: `${accent}15`,
                        color: accent,
                        fontWeight: 600,
                        borderRadius: 1.5,
                      }}
                    />
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
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
