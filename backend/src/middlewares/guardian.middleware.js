import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import { Guardian } from "../models/guardian.model.js"

export const verifyJwtGuardian = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new apiResponse(401, "Unauthorized request", {})
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await Guardian.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new apiResponse(401, "Unauthorized request", error.message)

    }
})