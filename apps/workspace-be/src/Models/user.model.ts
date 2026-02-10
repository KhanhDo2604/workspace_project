import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const bcryptSalt = process.env.BCRYPT_SALT;

const userSchema = new Schema({
  avatar: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  emailConfirm: { type: Boolean, default: false, required: true },
  personalSetting: { type: mongoose.Schema.Types.ObjectId, ref: "Setting" },
});

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
  this.password = hash;
  next();
});

export default mongoose.model("User", userSchema, "User");
