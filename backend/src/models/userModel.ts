import mongoose, { Document, Model, Schema, Types } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { deleteUserUploads } from "../services/documentService.js";

// 🔷 Interface for a single token object
interface IToken {
  token: string;
}

// 🔷 Interface for instance methods
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  tokens: IToken[];
  isAdmin: boolean;
  generateAuthToken(): Promise<string>;
  toJSON(): object;
}

// 🔷 Interface for static methods
export interface IUserModel extends Model<IUser> {
  findCredentials(email: string, password: string): Promise<IUser>;
}

// 🔷 Define schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value: string) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// 🔷 Hide private fields on JSON response
userSchema.methods.toJSON = function () {
  const user = this as IUser;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.tokens;

  return userObj;
};

// 🔷 JWT Auth method
userSchema.methods.generateAuthToken = async function (): Promise<string> {
  const user = this as IUser;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET as string);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// 🔷 Custom login method
userSchema.statics.findCredentials = async function (
  email: string,
  password: string,
): Promise<IUser> {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login!");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login!");
  }

  return user;
};

// 🔷 Password hashing middleware
userSchema.pre<IUser>("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.post("findOneAndDelete", async function (doc: IUser) {
  if (doc) {
    try {
      await deleteUserUploads(doc._id.toString());
      console.log(`Deleted uploads for user ${doc._id}`);
    } catch (err) {
      console.error(`Failed to delete user uploads for ${doc._id}:`, err);
    }
  }
});

// 🔷 Create and export model
const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;
