import jwt from "jsonwebtoken";

const generateRefreshToken = (userId, email, roles = ["buyer"], activeRole = "buyer") => {
  try {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
      throw new Error("REFRESH_TOKEN_SECRET environment variable is missing.");
    }

    const token = jwt.sign(
      {
        userId,
        email,
        roles,
        activeRole,
      },
      secret,
      {
        expiresIn: "30d",
      }
    );

    return token;
  } catch (error) {
    console.error("Refresh Token Generation Error:", error.message);
    throw new Error("Failed to generate refresh token");
  }
};

export default generateRefreshToken;
