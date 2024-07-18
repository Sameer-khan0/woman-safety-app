import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { Women } from "../models/women.model.js";

export const verifyJwtWomen = asyncHandler(async (req, _, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return next(new apiError(401, "Unauthorized request", {}));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await Women.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return next(new ApiError(401, "Invalid Access Token"));
    }

    req.user = user;
    
    next();
  } catch (error) {
    throw new apiResponse(401, "Unauthorized request", error.message)
  }
});
