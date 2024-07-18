import { asyncHandler } from "../utils/asyncHandler.js";
import { Guardian } from "../models/guardian.model.js"
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js"
import { Women } from "../models/women.model.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await Guardian.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating tokens");
    }
}


const registerGuardian = asyncHandler(async (req, res) => {
    const { name, email, password, notificationToken } = req.body;

    console.log(notificationToken)
    // Validation
    if (!name || !email || !password) {
        throw new apiError(400, "All fields are required");
    }

    // create user object - create entery in DB
    const guardian = await Guardian.create({
        name,
        email,
        password,
        notificationToken: notificationToken
    })

    console.log(guardian)

    if (!guardian) {
        throw new apiError("Something went wrong while registering the guardian");
    }

    return res.status(201).json(
        new apiResponse(200, "Guardian registered, please login", {guardian})
    )
})

const loginGuardian = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
        throw new apiError(400, "Either email or password is required");
    }

    // finding from database 
    const user = await Guardian.findOne({ email })
    if (!user) {
        throw new apiError(403, "Guardian does not exist")
    }

    // password match
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new apiError(403, "Invalid Password")
    }

    // access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await Guardian.findById(user._id).select('-password -refreshToken');

    // send cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200, { user: loggedInUser, accessToken },
                "Guardian Loggined Successfully"
            )
        )
})

const getAllGuardian = asyncHandler(async (req, res) => {
    const allGuardian = await Guardian.find()

    // validation
    if (!allGuardian) {
        return res.status(200).json(new apiResponse(200, {}, "No Guardian Found")
        )
    }
    else {
        return res.status(200).json(new apiResponse(200, allGuardian, "Guardian Fetched"))
    }
})


const updateGardianProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    const findGuardian = await Guardian.findById(req.user);
    if (!findGuardian) {
        throw new apiError(404, "User not found");
    }

    // Update product fields
    if (name) findGuardian.name = name;
    if (email) findGuardian.email = email;

    // Save the updated product
    const updatedGuardianId = await findGuardian.save();

    return res.status(200).json(
        new apiResponse(200, "Profile Updated", updatedGuardianId)
    )
})


const getAllGuardianWomen = asyncHandler(async (req, res) => {
    const guardianId = req.user;
    try {
        const guardian = await Guardian.findById(guardianId);
        if (!guardian) {
            return res.status(404).json(new apiResponse(404, {}, "Guardian not found"));
        }

        const women = await Women.find({ guardian: guardianId });

        if (women.length === 0) {
            return res.status(404).json(new apiResponse(404, {}, "No women found for the guardian"));
        }

        return res.status(200).json(new apiResponse(200, women, "Women fetched successfully"));
    } catch (error) {
        console.error("Error fetching guardian's women:", error);
        return res.status(500).json(new apiResponse(500, {}, "Failed to fetch women"));
    }
});

export {
    registerGuardian,
    loginGuardian,
    getAllGuardian,
    updateGardianProfile,
    getAllGuardianWomen
}