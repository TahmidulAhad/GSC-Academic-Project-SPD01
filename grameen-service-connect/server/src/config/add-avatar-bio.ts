import pool from "./database";

const addAvatarBioColumns = async () => {
  try {
    console.log("Adding avatar and bio columns to users table...");

    // Add avatar column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS avatar VARCHAR(500)
    `).catch((err) => {
      if (err.code !== 'ER_DUP_FIELDNAME') {
        throw err;
      }
      console.log("Column 'avatar' already exists");
    });

    // Add bio column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS bio TEXT
    `).catch((err) => {
      if (err.code !== 'ER_DUP_FIELDNAME') {
        throw err;
      }
      console.log("Column 'bio' already exists");
    });

    console.log("✅ Columns added successfully");
  } catch (error) {
    console.error("❌ Error adding columns:", error);
    throw error;
  } finally {
    process.exit(0);
  }
};

addAvatarBioColumns();
