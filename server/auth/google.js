// Thank you google documentation
const {google} = require('googleapis');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_SECRET,
} = process.env;

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// Access scopes for two non-Sign-In scopes: Read-only Drive activity and Google Calendar.
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

router.get("/google", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  req.session.state = state;

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
    state,
  });

  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (state !== req.session.state) {
      return res.status(400).send("Invalid state parameter");
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const { data: userInfo } = await oauth2.userinfo.get();

    const googleId = userInfo.id;
    const email = userInfo.email;
    const name = userInfo.name;
    const picture = userInfo.picture;
    const givenName = userInfo.given_name;
    const familyName = userInfo.family_name;

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
        [email, googleId, name, givenName, familyName, picture]
      );
    }

    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("/");
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).send("Authentication failed");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
