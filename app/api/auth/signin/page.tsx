"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

const SignIn: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: userInfo.email,
      password: userInfo.password,
      callbackUrl,
    });

    if (res && res.ok) {
      router.push(callbackUrl); // Redirect to intended page
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "32px" }}>
      <Paper elevation={3} style={{ padding: "32px" }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sign In
        </Typography>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              type="email"
              required
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
            <TextField
              label="Password"
              type="password"
              required
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            />
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#182887" }}
            >
              Sign In
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default SignIn;
