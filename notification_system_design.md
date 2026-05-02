# Stage 1

## Problem Summary

Stage 1 is focused on the service logic for a campus notification priority inbox. There is no UI or database requirement here. The script fetches notifications from the protected API, treats the returned list as unread for now, and selects the 10 notifications that should appear first.

## Priority Model

I used two things for priority: notification type and recency.

Type weights are assigned as follows:

- Placement = 3
- Result = 2
- Event = 1

For recency, the timestamp is converted with `new Date(timestamp).getTime()`. A newer timestamp has a higher value.

The final score is:

```ts
score = typeWeight * 1e13 + timestampMs;
```

The large multiplier makes type weight dominate the ranking, while timestamp breaks ties inside the same type.

## Data Flow

The script calls:

```txt
GET http://20.207.122.201/evaluation-service/notifications
Authorization: Bearer <ACCESS_TOKEN>
```

The response is parsed in memory. Since the API does not provide a read/unread field in Stage 1, all returned notifications are handled as unread.



## Efficient Maintenance:

For continuous incoming notifications, the code uses a min-heap with a fixed size of 10.

For each incoming notification:

- Compute its priority score.
- If the heap has fewer than 10 items, insert it.
- Otherwise, compare it with the smallest item currently in the heap.
- If the new notification has a higher score, replace the smallest item.
- If it has a lower score, ignore it.

This keeps only the current top 10 notifications in memory instead of sorting the full list again every time.

Time complexity:

- Per notification: `O(log k)`
- For this stage: `k = 10`, so insertion is effectively constant time.
- For `n` notifications: `O(n log k)`

## Logging

The script uses the custom logging middleware for the important steps:

- Fetching notifications
- Handling API failures
- Validating responses
- Computing priority
- Reporting completion or failure

This makes failures easier to trace and keeps the code aligned with the requirement to use the reusable middleware instead of direct logger calls.

## Conclusion

This approach gives the highest priority notifications using a simple scoring rule, while still being efficient enough to handle new notifications as they arrive.
