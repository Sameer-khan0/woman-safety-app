import { asyncHandler } from "../utils/asyncHandler.js";
import { Alert } from "../models/alert.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Women } from "../models/women.model.js";
import { Guardian } from "../models/guardian.model.js";

// Add Alert
const addAlert = asyncHandler(async (req, res) => {
  const { latitude, longitude, alerttype, guardianIds } = req.body;

  // Validation
  if (!latitude || !longitude || !alerttype || !guardianIds) {
    throw new apiError(400, "All fields are required");
  }

  const womenId = req.user._id;
  const existingAlert = await Alert.findOne({ women: womenId });

  // Fetch guardians' notification tokens
  const guardians = await Guardian.find({ _id: { $in: guardianIds } });
  const notificationTokens = guardians.map(guardian => guardian.notificationToken).filter(Boolean);

  if (notificationTokens.length === 0) {
    throw new apiError(400, "No valid notification tokens found for guardians");
  }

  const title = "Emergency Alert";
  const body = "I am in danger, please help me.";

  // Send notifications to all guardians
  const sendNotification = async (token) => {
    const message = {
      to: token,
      sound: 'default',
      title: title,
      body: body,
      data: { title, body },
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Error sending notification to token ${token}:`, data);
    }
    return data;
  };

  // Send notifications to all guardian tokens
  const notificationResults = [];
  for (const token of notificationTokens) {
    const result = await sendNotification(token);
    notificationResults.push(result);
  }

  // Handle alert creation or update
  if (existingAlert) {
    existingAlert.latitude = latitude;
    existingAlert.longitude = longitude;
    existingAlert.guardian = guardianIds;
    await existingAlert.save();
    return res.status(201).json(new apiResponse(200, "Alert Sent", { alertId: existingAlert._id, notifications: notificationResults }));
  } else {
    const createdAlert = await Alert.create({
      latitude,
      longitude,
      alerttype,
      women: womenId,
      guardian: guardianIds,
    });

    if (!createdAlert) {
      throw new apiError(400, "Error while saving alert");
    }

    return res.status(201).json(new apiResponse(200, "Alert Sent", { alertId: createdAlert._id, notifications: notificationResults }));
  }
});

// Check Alert Status
const checkAlertStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const checkAlert = await Alert.find({
    $or: [{ women: userId }, { guardian: userId }],
  });

  if (!checkAlert.length) {
    return res.status(200).json(new apiResponse(200, "No Alert Found", {}));
  }

  const womenIds = checkAlert.map((alert) => alert.women);
  const womenData = await Women.find({ _id: { $in: womenIds } });

  const responseData = {
    alertId: checkAlert[0]._id,
    latitude: checkAlert[0].latitude,
    longitude: checkAlert[0].longitude,
    name: womenData[0].name,
    phonenumber: womenData[0].phonenumber,
  };

  return res
    .status(200)
    .json(new apiResponse(200, "Alert Found", responseData));
});

// Remove Alert
const removeAlert = asyncHandler(async (req, res) => {
  const { alertId } = req.body;
  const deletedAlert = await Alert.findByIdAndDelete(alertId);

  if (!deletedAlert) {
    throw new apiError(400, "Error While Deleting Alert");
  }

  return res.status(200).json(new apiResponse(200, "Alert Deleted"));
});

export { addAlert, checkAlertStatus, removeAlert };
