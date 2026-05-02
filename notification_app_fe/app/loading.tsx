import { Card, CardContent, Skeleton, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Stack spacing={3} sx={{ p: { xs: 3, md: 6 } }}>
      <Skeleton variant="text" width={180} height={24} />
      <Skeleton variant="text" width="50%" height={54} />
      <Skeleton variant="rounded" width="100%" height={120} />
      <Card elevation={0} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Skeleton variant="text" width="35%" height={28} />
            <Skeleton variant="text" width="100%" height={44} />
            <Skeleton variant="rounded" width="100%" height={220} />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
