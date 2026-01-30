import pool from "../config/database";

export const createRequest = async (req: any, res: any) => {
  try {
    console.log(req.body);

    const { name, contact, category, description, location } = req.body;
    const userId = (req as any).user.userId;
    const documentPath = (req as any).file ? (req as any).file.path : null;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Authentication required to submit a request" });
    }

    const [result] = await pool.query(
      `INSERT INTO service_requests (user_id, name, contact, category, description, location, document_path, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userId,
        name,
        contact || null,
        category,
        description,
        location || null,
        documentPath,
      ]
    ) as any[];

    // Get the inserted request
    const [requests] = await pool.query(
      "SELECT * FROM service_requests WHERE id = ?",
      [result.insertId]
    ) as any[];

    res.status(201).json({
      message: "Request submitted successfully",
      request: requests[0],
    });
  } catch (error: any) {
    console.error("Create request error:", error);
    if (error.code === "23503") {
      return res.status(400).json({
        error: "User not found. Please log out and log in again.",
      });
    }
    res.status(500).json({ error: "Failed to create request" });
  }
};

export const getAllRequests = async (req: any, res: any) => {
  try {
    const { status, limit = 50 } = req.query;

    let query = `
      SELECT sr.*, u.full_name as requester_name, u.email as requester_email
      FROM service_requests sr
      LEFT JOIN users u ON sr.user_id = u.id
    `;
    const params: any[] = [];

    if (status) {
      query += " WHERE sr.status = ?";
      params.push(status);
    }

    query += " ORDER BY sr.created_at DESC LIMIT ?";
    params.push(limit);

    const [result] = await pool.query(query, params) as any[];

    res.json({
      requests: result,
      count: result.length,
    });
  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).json({ error: "Failed to get requests" });
  }
};

export const getRequestById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `SELECT sr.*, u.full_name as requester_name, u.email as requester_email,
              v.full_name as volunteer_name
       FROM service_requests sr
       LEFT JOIN users u ON sr.user_id = u.id
       LEFT JOIN users v ON sr.volunteer_id = v.id
       WHERE sr.id = ?`,
      [id]
    ) as any[];

    if (result.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Get request error:", error);
    res.status(500).json({ error: "Failed to get request" });
  }
};

export const updateRequestStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status, volunteerId } = req.body;
    const userId = (req as any).user.userId;

    const updateFields: string[] = [
      "status = ?",
      "updated_at = CURRENT_TIMESTAMP",
    ];
    const params: any[] = [status];

    if (volunteerId) {
      updateFields.push("volunteer_id = ?");
      params.push(volunteerId);
    }

    params.push(id);

    await pool.query(
      `UPDATE service_requests 
       SET ${updateFields.join(", ")}
       WHERE id = ?`,
      params
    );

    // Get the updated request
    const [result] = await pool.query(
      "SELECT * FROM service_requests WHERE id = ?",
      [id]
    ) as any[];

    if (result.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({
      message: "Request updated successfully",
      request: result[0],
    });
  } catch (error) {
    console.error("Update request error:", error);
    res.status(500).json({ error: "Failed to update request" });
  }
};

export const getUserRequests = async (req: any, res: any) => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    let query = "";
    let params: any[] = [];

    if (userRole === "volunteer") {
      // For volunteers, show requests where they are assigned as volunteer
      query = `SELECT sr.*, u.full_name as requester_name, u.email as requester_email
       FROM service_requests sr
       LEFT JOIN users u ON sr.user_id = u.id
       WHERE sr.volunteer_id = ?
       ORDER BY sr.created_at DESC`;
      params = [userId];
    } else {
      // For help seekers and others, show requests they created
      query = `SELECT sr.*, v.full_name as volunteer_name
       FROM service_requests sr
       LEFT JOIN users v ON sr.volunteer_id = v.id
       WHERE sr.user_id = ?
       ORDER BY sr.created_at DESC`;
      params = [userId];
    }

    const [result] = await pool.query(query, params) as any[];

    res.json({
      requests: result,
      count: result.length,
    });
  } catch (error) {
    console.error("Get user requests error:", error);
    res.status(500).json({ error: "Failed to get user requests" });
  }
};
