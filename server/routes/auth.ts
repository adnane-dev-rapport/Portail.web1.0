import { RequestHandler } from "express";
import { queryOne, queryMany, query } from "../lib/db";

/**
 * Register a new user
 * Inserts user data into PostgreSQL users table
 */
export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      birth_date,
      gender,
      user_phone,
      patrol_id,
      role_id,
      is_high_patrol,
      guardian_first_name,
      guardian_last_name,
      guardian_relationship,
      guardian_relationship_other,
      guardian_cin,
      father_phone,
      mother_phone,
      home_phone,
      additional_info,
      password,
    } = req.body;

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !birth_date ||
      !gender ||
      !user_phone ||
      !patrol_id ||
      !role_id ||
      !password
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert into users table
    const result = await query(
      `INSERT INTO users (
        first_name, last_name, birth_date, gender, user_phone, patrol_id, role_id,
        is_high_patrol, guardian_first_name, guardian_last_name, guardian_relationship,
        guardian_relationship_other, guardian_cin, father_phone, mother_phone, home_phone,
        additional_info, password
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id, generated_id, first_name, last_name, user_phone, gender`,
      [
        first_name, last_name, birth_date, gender, user_phone, patrol_id, role_id,
        is_high_patrol || false, guardian_first_name, guardian_last_name,
        guardian_relationship, guardian_relationship_other, guardian_cin,
        father_phone, mother_phone, home_phone, additional_info, password
      ]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Registration failed" });
    }

    const user = result.rows[0];

    // Return user data
    res.json({
      id: user.id,
      generated_id: user.generated_id,
      first_name: user.first_name,
      last_name: user.last_name,
      user_phone: user.user_phone,
      gender: user.gender,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Login user
 * Validates first_name, last_name, generated_id, and password against PostgreSQL users table
 */
export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { first_name, last_name, generated_id, password } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !generated_id || !password) {
      return res.status(400).json({
        error: "First name, last name, ID, and password are required"
      });
    }

    // Query users table to find user with matching first_name, last_name and generated_id
    const user = await queryOne(
      `SELECT * FROM users 
       WHERE first_name = $1 AND last_name = $2 AND generated_id = $3`,
      [first_name, last_name, generated_id]
    );

    if (!user) {
      console.error("Login error - user not found");
      return res.status(401).json({
        error: "بيانات الدخول غير صحيحة - تأكد من الاسم ورقم العضو"
      });
    }

    // Verify password (simple comparison - في الإنتاج يجب استخدام bcrypt)
    // For now, we're using a simple password check
    // In production, passwords should be hashed
    if (password !== user.password) {
      return res.status(401).json({
        error: "كلمة المرور غير صحيحة"
      });
    }

    // Return user data on successful login
    res.json({
      id: user.id,
      generated_id: user.generated_id,
      first_name: user.first_name,
      last_name: user.last_name,
      user_phone: user.user_phone,
      gender: user.gender,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get user profile
 * Returns logged-in user's data
 */
export const handleGetProfile: RequestHandler = async (req, res) => {
  try {
    const { generated_id } = req.query;

    if (!generated_id || typeof generated_id !== "string") {
      return res.status(400).json({ error: "Generated ID is required" });
    }

    const user = await queryOne(
      `SELECT * FROM users WHERE generated_id = $1`,
      [generated_id]
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      generated_id: user.generated_id,
      first_name: user.first_name,
      last_name: user.last_name,
      user_phone: user.user_phone,
      gender: user.gender,
    });
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Save PDF and QR code for a user
 * Stores the PDF and QR code data in PostgreSQL
 */
export const handleSavePdfQrCode: RequestHandler = async (req, res) => {
  try {
    const {
      user_id,
      generated_id,
      pdf_url,
      qr_code_url,
    } = req.body;

    if (!user_id || !pdf_url || !qr_code_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Update user with PDF and QR code URLs
    const result = await query(
      `UPDATE users 
       SET pdf_url = $1, qr_code_url = $2, documents_generated_at = NOW()
       WHERE id = $3
       RETURNING id, generated_id, pdf_url, qr_code_url`,
      [pdf_url, qr_code_url, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      message: "PDF and QR code saved successfully",
      user: {
        id: user.id,
        generated_id: user.generated_id,
        pdf_url: user.pdf_url,
        qr_code_url: user.qr_code_url,
      },
    });
  } catch (error) {
    console.error("Error saving PDF/QR code:", error);
    res.status(500).json({ error: "Server error" });
  }
};
