import UserProfile from "../models/UserProfile.js";

export const getProfile = async (userId) => {
  return await UserProfile.findOne({ userId });
};

export const updateProfile = async (userId, data) => {
  return await UserProfile.findOneAndUpdate(
    { userId },
    data,
    { new: true, upsert: true }
  );
};