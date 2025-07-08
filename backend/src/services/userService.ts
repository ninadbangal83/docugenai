import User, { IUser } from "../models/userModel.js";

// Create user
const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  try {
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw new Error("Could not create user");
  }
};

// Authenticate user
const authenticateUser = async (
  email: string,
  password: string,
): Promise<{ user: IUser; token: string }> => {
  try {
    const user = await User.findCredentials(email, password);
    const token = await user.generateAuthToken();
    return { user, token };
  } catch (error) {
    throw new Error("Authentication failed");
  }
};

// Logout user
const logoutUser = async (user: IUser, token: string): Promise<boolean> => {
  try {
    user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();
    return true;
  } catch (error) {
    throw new Error("Logout failed");
  }
};

// Update profile
export const updateUserProfile = async (
  req: { user: IUser; body: Record<string, any> },
  updates: string[],
): Promise<IUser> => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new Error("User not found");
  }

  updates.forEach((update) => {
    (user as any)[update] = req.body[update];
  });

  await user.save();
  return user;
};

// Delete user
const deleteUser = async (userId: string): Promise<IUser> => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

// Export all as default
export default {
  createUser,
  authenticateUser,
  logoutUser,
  updateUserProfile,
  deleteUser,
};
