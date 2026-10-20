import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import ShowCarousel from "../components/ShowCarousel/ShowCarousel";
import { useAuth } from "../features/auth/authContext";
import api from "../lib/apiClient";

const shows = [
    {
        id: 1,
        title: 'Breaking Bad',
    },
    {
        id: 2,
        title: 'The Bear'
    },
    {
        id: 3,
        title: 'Stranger Things'
    }, {
        id: 4,
        title: 'Stranger Things'
    }, {
        id: 5,
        title: 'Stranger Things'
    }, {
        id: 6,
        title: 'Stranger Things'
    },
    {
        id: 7,
        title: 'Stranger Things'
    },
    {
        id: 8,
        title: 'Stranger Things'
    },
];

type Show = {
  id: number;
  title: string;
};

type ListItem = {
  id: number;
  tmdb_id: number;
};

type ShowList = {
  id: number;
  name: string;
  list_type: string | null;
  items: ListItem[];
};

export const Home = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState<ShowList[]>([]);
  const [showsByList, setShowsByList] = useState<Record<number, Show[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (!user) {
    setLists([]);
    setShowsByList({});
    return;
  }

  const controller = new AbortController();
  setLoading(true);
  setError(null);

  (async () => {
    try {
      const { data } = await api.get<ShowList[]>("/lists/", {
        signal: controller.signal,
      });

      const ids = [...new Set(data.flatMap((l) => l.items.map((i) => i.tmdb_id)))];
      const details = await Promise.allSettled(
        ids.map((id) =>
          api
            .get<{ name: string }>(`/shows/${id}/`, { signal: controller.signal })
            .then(({ data }) => [id, data.name] as const)
        )
      );
      const names = new Map(
        details.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []))
      );

      setLists(data);
      setShowsByList(
        Object.fromEntries(
          data.map((l) => [
            l.id,
            l.items
              .filter((i) => names.has(i.tmdb_id))
              .map((i) => ({ id: i.tmdb_id, title: names.get(i.tmdb_id)! })),
          ])
        )
      );
    } catch {
      if (!controller.signal.aborted) setError("Failed to load your lists.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  })();

  return () => controller.abort();
}, [user]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">
        {user ? `Hello, ${user.first_name || user.email}` : "Welcome"}
      </Typography>

      <Box sx={{ p: 3 }}>
        <ShowCarousel title="Trending" shows={shows} />

        {loading && <CircularProgress />}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading &&
          lists.map((list) => (
            <ShowCarousel
              key={list.id}
              title={list.name}
              shows={showsByList[list.id] ?? []}
            />
          ))}
      </Box>
    </Box>
  );
};