import express from "express";
import verifyToken from "../Middleware/authmiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

export default router;
