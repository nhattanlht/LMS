import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    dateOfBirth: Date,
    gender: String,
    address: String,
    levelEducation: String,
    typeEducation: String,
    major: String,
    faculty: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    mainrole: {
      type: String,
      default: "student",
      enum: ["lecturer", "student", "admin", "superadmin"],
    },
    subscription: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
      },
    ],
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);
