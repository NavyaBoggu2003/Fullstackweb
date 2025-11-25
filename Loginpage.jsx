import React, { useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password)
      return setError("All fields are required");

    try {
      await login(form.email, form.password);
      navigate("/board");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background:
          "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #f6e6b4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        overflow: "hidden",
      }}
    >
      <Card
        sx={{
          width: 420,
          p: 4,
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.8)",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", color: "#e91e63", fontWeight: 700 }}
        >
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidths
            sx={{
              mt: 2,
              backgroundColor: "#ff6699",
              "&:hover": { backgroundColor: "#ff4d88" },
              fontWeight: 600,
            }}
          >
            LOGIN
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link component={RouterLink} to="/reg" sx={{ color: "#e91e63" }}>
              Register
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
