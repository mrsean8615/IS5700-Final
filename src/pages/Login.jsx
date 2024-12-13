import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useAuth } from "../context/AuthProvider";
import { loginAdmin } from "../api/loginAdmin";
import { use } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    const isAuthenticated = await loginAdmin(username, password);
    if (isAuthenticated) {
      login(username);
      navigate("/adminProduct");
    } else {
      // console.log("login failed");
      setError("Invalid username or password");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Login
        </Typography>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
