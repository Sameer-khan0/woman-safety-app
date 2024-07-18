import { asyncHandler } from "../utils/asyncHandler.js";
import { Women } from "../models/women.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Guardian } from "../models/guardian.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await Women.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, "Something went wrong while generating tokens");
  }
};

const registerWomen = asyncHandler(async (req, res) => {
  const { name, email, password, address, phnumber, guardianId,notificationToken } = req.body;

  // Validation
  if (!name || !email || !password || !address || !phnumber || !guardianId) {
    throw new apiError(400, "All fields are required");
  }
  const guardian = await Guardian.findById(guardianId);

  if (!guardian) {
    return res.status(404).json({ error: "Guardian not found" });
  }

  // Create Women record
  const women = await Women.create({
    name,
    email,
    password,
    address,
    phnumber,
    guardian: guardian._id,
    notificationToken: notificationToken
  });
  // const guardian = await Guardian.findById(guardianId)

  // Check if creation was successful
  if (!women) {
    throw new apiError("Something went wrong while registering the woman");
  }

  // Return success response
  return res
    .status(201)
    .json(new apiResponse(200, "Women registered", { women }));
});

const loginWomen = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    throw new apiError(400, "Either email or password is required");
  }

  // finding from database
  const user = await Women.findOne({ email });
  if (!user) {
    throw new apiError(403, "user does not exist");
  }

  // password match
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(403, "Invalid Password");
  }

  // access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await Women.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User Loggined Successfully"
      )
    );
});

const AddGuardian = asyncHandler(async (req, res) => {
    const guardianId = req.body.guardianId;
    const womanId = req.user


    try {
        const woman = await Women.findById(womanId);
        if (!woman) {
            return res.status(404).json({ error: "Woman not found" });
        }

        const guardian = await Guardian.findById(guardianId);
        if (!guardian) {
            return res.status(404).json({ error: "Guardian not found" });
        }

        if (woman.guardian.includes(guardianId)) {
            return res.status(400).json({ error: "Guardian already added to this woman" });
        }

        woman.guardian.push(guardianId);
        await woman.save();

        return res.status(200).json({ message: "Guardian added successfully", woman });
    } catch (error) {
        console.error("Error adding guardian:", error);
        return res.status(500).json({ error: "Failed to add guardian" });
    }
})

const GetWomanGuardian = asyncHandler(async (req, res) => {
    const womanId = req.user; // Assuming req.user contains the ID of the logged-in woman

    try {
        const woman = await Women.findById(womanId);
        if (!woman) {
            return res.status(404).json(new apiResponse(404, {}, "Woman not found"));
        }

        const guardians = [];
        if (woman.guardian.length > 0) {
            for (const guardianId of woman.guardian) {
                const guardian = await Guardian.findById(guardianId);
                if (guardian) {
                    guardians.push(guardian);
                }
            }
        }

        if (guardians.length === 0) {
            return res.status(404).json(new apiResponse(404, {}, "No guardians found for the woman"));
        }

        return res.status(200).json(new apiResponse(200, guardians, "Guardians fetched successfully"));
    } catch (error) {
        console.error("Error fetching woman's guardians:", error);
        return res.status(500).json(new apiResponse(500, {}, "Failed to fetch guardians"));
    }
});
  

const updateWomenProfile = asyncHandler(async (req, res) => {
  const { name, email, address, phnumber, guardianId } = req.body;
  const updatedWomen = await Women.findById(req.user);
  if (!updatedWomen) {
    throw new apiError(404, "User not found");
  }

  // Update product fields
  if (name) updatedWomen.name = name;
  if (email) updatedWomen.email = email;
  if (address) updatedWomen.address = address;
  if (phnumber) updatedWomen.phnumber = phnumber;
  if (guardianId) updatedWomen.guardian = guardianId;

  // Save the updated product
  const updatedWomenId = await updatedWomen.save();

  return res
    .status(200)
    .json(new apiResponse(200, "Profile Updated", updatedWomenId));
});

export { registerWomen, loginWomen, updateWomenProfile, GetWomanGuardian,AddGuardian };
