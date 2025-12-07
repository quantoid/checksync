import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Alert, Button } from "@mui/material";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function ping() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/healthz`);
      if (!res.ok) throw new Error("network");
      const json = await res.json();
      setStatus({ ok: true, data: json });
    } catch (err) {
      setStatus({ ok: false, error: String(err) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial ping (safe even if API_BASE is empty)
    ping();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Box textAlign="center" width="100%">
        <Typography variant="h2" component="h1" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          CheckSync is on its way.
        </Typography>

        <Box mt={4}>
          <Button variant="contained" onClick={ping} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Check Health"}
          </Button>
        </Box>

        <Box mt={3}>
          {status === null ? (
            <Typography color="textSecondary">Press &quot;Check Health&quot; to verify backend.</Typography>
          ) : status.ok ? (
            <Alert severity="success">Backend OK — {JSON.stringify(status.data)}</Alert>
          ) : (
            <Alert severity="error">Backend unreachable — {status.error}</Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}
