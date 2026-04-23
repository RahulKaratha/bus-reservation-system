import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
{
  userId: {
    type: String,
    required: true,
    unique: true
  },

  name: String,

  email: String,

  phone: String,

  avatar: String

},
{ timestamps: true }
);

export default mongoose.model("UserProfile", userProfileSchema);