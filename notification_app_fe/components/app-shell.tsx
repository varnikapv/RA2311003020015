import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

type AppShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function AppShell({
  title,
  description,
  children,
}: AppShellProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f4efe6 0%, #faf8f4 32%, #ffffff 100%)",
      }}
    >
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: "1px solid rgba(19, 28, 35, 0.08)",
          backdropFilter: "blur(16px)",
          backgroundColor: "rgba(250, 248, 244, 0.86)",
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 0, sm: 2 },
            }}
          >
            <Stack spacing={0.25}>
              <Typography
                variant="overline"
                sx={{ color: "#b35c2e", letterSpacing: "0.08em" }}
              >
                Notification App
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#13222b", fontWeight: 700 }}
              >
                Priority Inbox
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button component={Link} href="/" color="inherit">
                All Notifications
              </Button>
              <Button component={Link} href="/priority" color="inherit">
                Priority View
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#13222b",
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#4f5f6a", maxWidth: 720, lineHeight: 1.7 }}
          >
            {description}
          </Typography>
        </Stack>

        {children}
      </Container>
    </Box>
  );
}

