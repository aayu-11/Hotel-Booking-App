import jwt from "jsonwebtoken";
import { createError } from "./error.js";

// Middleware to verify the token and attach the user to the request object
export const verifyToken = (req, res, next) => {
  // Check for token in cookies first
  const token =
    req.cookies.access_token ||
    (req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    console.log("No token found in request");
    return next(createError(401, "You are not authenticated!"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token verification failed:", err.message);
    return next(createError(403, "Token is not valid!"));
  }
};

// Middleware to check if the user is authorized (either the user themselves or an admin)
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err); // Pass any errors from verifyToken

    // Get the user ID from either params.id or params.userId
    const requestedUserId = req.params.id || req.params.userId;

    if (req.user.id === requestedUserId || req.user.isAdmin) {
      next();
    } else {
      console.log("User not authorized:", {
        authenticatedUserId: req.user.id,
        requestedUserId: requestedUserId,
        isAdmin: req.user.isAdmin,
      });
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// Middleware to check if the user is an admin
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err); // Pass any errors from verifyToken
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
