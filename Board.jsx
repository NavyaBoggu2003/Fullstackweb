
import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { AuthContext } from "../components/AuthContext";
import api from "../services/api";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch profile
  useEffect(() => {
    api
      .get("/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Failed to load profile", err));
  }, []);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add or edit task
  const handleAddEditTask = async () => {
    if (!taskTitle.trim()) return;
    try {
      if (editingTask) {
        const res = await api.put(`/tasks/${editingTask._id}`, { title: taskTitle });
        setTasks(tasks.map((t) => (t._id === editingTask._id ? res.data : t)));
        setEditingTask(null);
      } else {
        const res = await api.post("/tasks", { title: taskTitle });
        setTasks([...tasks, res.data]);
      }
      setTaskTitle("");
    } catch (err) {
      console.error("Failed to save task", err.response?.data?.message || err.message);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete task", err.response?.data?.message || err.message);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (task) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error("Failed to update task", err.response?.data?.message || err.message);
    }
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #f6e6b4 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 5,
      }}
    >
      <Card sx={{ width: 600, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name || user?.email}
        </Typography>

        {profile && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1">Profile:</Typography>
            <Typography>Name: {profile.name}</Typography>
            <Typography>Email: {profile.email}</Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Enter task..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddEditTask}>
            {editingTask ? "Update" : "Add"}
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Task List */}
        <List>
          {filteredTasks.map((task) => (
            <ListItem key={task._id} divider>
              <Checkbox
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
              />
              <ListItemText
                primary={task.title}
                sx={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => { setTaskTitle(task.title); setEditingTask(task); }}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteTask(task._id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          color="error"
          sx={{ mt: 3 }}
          onClick={logout}
        >
          Logout
        </Button>
      </Card>
    </Box>
  );
}
