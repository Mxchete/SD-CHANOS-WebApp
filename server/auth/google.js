// Thank you google documentation
// TODO: bulk of this can probably be reformatted out of this file and into the rest of the API structure, time permitting
const {google} = require('googleapis');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const dotenv = require("dotenv");
const pool = require("../config");
const { OAuth2Client } = require("google-auth-library");

dotenv.config();

const router = express.Router();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_SECRET,
} = process.env;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google/verify", async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture, given_name, family_name } = payload;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE google_id = $1",
      [googleId]
    );

    let user;
    if (existingUser.rows.length > 0) {
      user = await pool.query(
        `UPDATE users
         SET email=$1, name=$2, picture_url=$3, last_login_at=NOW(), updated_at=NOW()
         WHERE google_id=$4
         RETURNING *`,
        [email, name, picture, googleId]
      );
    } else {
      user = await pool.query(
        `INSERT INTO users (email, google_id, name, given_name, family_name, picture_url, created_at, last_login_at)
         VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
         RETURNING *`,
        [email, googleId, name, given_name, family_name, picture]
      );
    }

    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Oasuth error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
