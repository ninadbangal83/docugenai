import { Response } from "express";
import userService from "../services/userService.js";
import { AuthRequest } from "../middleware/auth.js"; // Make sure AuthRequest is exported from auth middleware
import User from "../models/userModel.js";

// 🔹 Create user
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log("create");
    const newUser = await userService.createUser(req.body);
    const token = await newUser.generateAuthToken();
    res.status(201).json({
      status: "success",
      newUser,
      token,
      message: "User registered successfully!",
    });
  } catch {
    res.status(400).json({
      status: "failed",
      message: "Email id already exists!",
    });
  }
};

// 🔹 Login
export const loginUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.authenticateUser(email, password);
    res.status(200).json({
      status: "success",
      user,
      token,
      message: "User logged in successfully!",
    });
  } catch {
    res.status(400).json({ status: "failed", message: "Login failed!" });
  }
};

// 🔹 Logout
export const logoutUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.token) {
      res.status(401).json({ status: "failed", message: "Unauthorized" });
      return;
    }

    await userService.logoutUser(req.user, req.token);
    res.status(200).json({ status: "success", message: "Logout successful!" });
  } catch {
    res.status(500).json({ status: "failed", message: "Logout failed!" });
  }
};

// 🔹 Fetch user
export const fetchUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: "failed", message: "Unauthorized" });
      return;
    }

    res.status(200).json({
      status: "success",
      user: req.user,
      message: "User fetched successfully!",
    });
  } catch {
    res.status(500).json({ status: "failed", message: "Failed to fetch user!" });
  }
};

// 🔹 Update user
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  const updates = Object.keys(req.body);
  const allowed = ["name", "age", "email", "password"];
  const isValid = updates.every((key) => allowed.includes(key));

  if (!isValid) {
    res.status(400).send({ status: "failed", message: "Invalid updates!" });
    return;
  }

  if (!req.user) {
    res.status(401).send({ status: "failed", message: "Unauthorized" });
    return;
  }

  try {
    const updatedUser = await userService.updateUserProfile(
      { user: req.user, body: req.body },
      updates,
    );

    res.send({
      status: "success",
      user: updatedUser,
      message: "User profile updated successfully!",
    });
  } catch {
    res.status(500).send({
      status: "failed",
      message: "Failed to update profile!",
    });
  }
};

// 🔹 Delete user
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: "failed", message: "Unauthorized" });
      return;
    }

    const deletedUser = await userService.deleteUser(req.user._id.toString());
    res.status(200).json({
      status: "success",
      user: deletedUser,
      message: "Account deleted successfully!",
    });
  } catch {
    res.status(500).json({ status: "failed", message: "Failed to delete account!" });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  console.log("object");
  const users = await User.find().select("-password -tokens");
  res.json(users);
};

export const deleteUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
        if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({
      message: "User and associated files deleted successfully",
      user: deletedUser,
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

