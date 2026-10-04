import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      console.error("ACCESS_TOKEN_SECRET environment variable is missing.");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    const decoded = jwt.verify(token, secret);

    const userId = decoded._id || decoded.userId || decoded.id;

    req.user = {
      ...decoded,
      _id: userId,
      id: userId,
      userId: userId,
      roles: Array.isArray(decoded.roles) ? decoded.roles : ["buyer"],
      activeRole: decoded.activeRole || "buyer",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User authentication required",
      });
    }

    // Admins bypass role restrictions
    if (req.user.roles?.includes("admin") || req.user.activeRole === "admin") {
      return next();
    }

    const hasRole = roles.some(
      (role) => req.user.activeRole === role || req.user.roles?.includes(role)
    );

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Insufficient role permissions",
      });
    }

    next();
  };
};

export default authMiddleware;
