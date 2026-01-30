import pool from "../config/database";

export const updateProfile = async (req: any, res: any) => {
  try {
    const userId = (req as any).user.userId;
    const { fullName, phone, location, bio } = req.body;
    const avatarPath = (req as any).file ? (req as any).file.path : null;

    // Build update query dynamically
    const updateFields: string[] = [];
    const params: any[] = [];

    if (fullName) {
      updateFields.push("full_name = ?");
      params.push(fullName);
    }
    if (phone !== undefined) {
      updateFields.push("phone = ?");
      params.push(phone || null);
    }
    if (location !== undefined) {
      updateFields.push("location = ?");
      params.push(location || null);
    }
    if (bio !== undefined) {
      updateFields.push("bio = ?");
      params.push(bio || null);
    }
    if (avatarPath) {
      updateFields.push("avatar = ?");
      params.push(avatarPath);
    }

    if (updateFields.length > 0) {
      updateFields.push("updated_at = CURRENT_TIMESTAMP");
      params.push(userId);

      await pool.query(
        `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
        params
      );
    }

    // Get the updated user
    const [result] = await pool.query(
      "SELECT id, full_name, email, phone, role, location, avatar, bio FROM users WHERE id = ?",
      [userId]
    ) as any[];

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result[0];

    res.json({
      message: "Profile updated successfully",
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
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
