import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const womenschema = new Schema(
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
    address: {
      type: String,
      required: true,
    },
    phnumber: {
      type: String,
      required: true,
      index: true,
    },
    guardian: [
      {
        type: Schema.Types.ObjectId,
        ref: "Guardian",
      },
    ],
    refreshToken: {
      type: String,
    },
    notificationToken: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

womenschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

womenschema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

womenschema.methods.generateAccessToken = function () {
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

womenschema.methods.generateRefreshToken = function () {
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

export const Women = mongoose.model("Women", womenschema);
