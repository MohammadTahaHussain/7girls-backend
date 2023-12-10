import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that each email is unique
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User
