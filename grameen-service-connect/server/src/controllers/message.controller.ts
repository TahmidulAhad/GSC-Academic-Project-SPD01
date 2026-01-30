import pool from "../config/database";

export const createMessage = async (req: any, res: any) => {
  try {
    const { name, email, subject, message } = req.body;

    const [result] = await pool.query(
      `INSERT INTO messages (name, email, subject, message) 
       VALUES (?, ?, ?, ?)`,
      [name, email, subject, message]
    ) as any[];

    // Get the inserted message
    const [messages] = await pool.query(
      "SELECT * FROM messages WHERE id = ?",
      [result.insertId]
    ) as any[];

    res.status(201).json({
      message: "Message sent successfully",
      data: messages[0],
    });
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getAllMessages = async (req: any, res: any) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    ) as any[];

    res.json({
      messages: result,
      count: result.length,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
};
