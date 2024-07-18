import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const guardianschema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true, // for serching purpose
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    women: [
      {
        type: Schema.Types.ObjectId,
        ref: "Women",
      },
    ],
    refreshToken: {
      type: String,
    },
    notificationToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

guardianschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

guardianschema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

guardianschema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      phnumber: this.phnumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

guardianschema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Guardian = mongoose.model("Guardian", guardianschema);
