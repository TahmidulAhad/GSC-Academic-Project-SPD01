import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database";

export const register = async (req: any, res: any) => {
  try {
    const { fullName, email, password, phone, role, location } = req.body;

    // Check if user already exists
    const [userExists] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    ) as any[];

    if (userExists.length > 0) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password, phone, role, location) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [fullName, email, hashedPassword, phone || null, role, location || null]
    ) as any[];

    // Get the inserted user
    const [users] = await pool.query(
      "SELECT id, full_name, email, phone, role, location, avatar, bio, created_at FROM users WHERE id = ?",
      [result.insertId]
    ) as any[];
    const user = users[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        avatar: user.avatar,
        bio: user.bio,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]) as any[];

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
    );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        avatar: user.avatar,
        bio: user.bio,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

export const getProfile = async (req: any, res: any) => {
  try {
    const userId = (req as any).user.userId;

    const [result] = await pool.query(
      "SELECT id, full_name, email, phone, role, location, avatar, bio, created_at FROM users WHERE id = ?",
      [userId]
    ) as any[];

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result[0];

    res.json({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};
