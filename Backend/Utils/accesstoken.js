import jwt from "jsonwebtoken";

const generateAccessToken = (userId, email, roles = ["buyer"], activeRole = "buyer") => {
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET environment variable is missing.");
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
        expiresIn: "7d", // Generous token lifetime for mobile & web apps
      }
    );

    return token;
  } catch (error) {
    console.error("Access Token Generation Error:", error.message);
    throw new Error("Failed to generate access token");
  }
};

export default generateAccessToken;
