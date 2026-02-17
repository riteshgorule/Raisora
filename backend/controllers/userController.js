import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

// Return the authenticated user's profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId).select("username role createdAt updatedAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("getProfile error", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

// Update username and/or password for authenticated user
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { username, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle username change
    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ message: "Username already taken" });
      user.username = username;
    }

    // Handle password change if provided
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: "Current password is required" });
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return res.status(400).json({ message: "Current password is incorrect" });
      if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.json({
      ok: true,
      message: "Profile updated",
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("updateProfile error", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export { getProfile, updateProfile };