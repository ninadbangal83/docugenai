import mongoose from 'mongoose';
import User from '../models/userModel.js';

const mongoURI = process.env.MONGODB_URL as string;

if (!mongoURI) {
  throw new Error('MONGODB_URL is not defined in environment variables.');
}

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log('🔨 Creating admin user...');
      const adminUser = new User({
        name: 'admin',
        email: adminEmail,
        password: 'admin',
        isAdmin: true,
      });

      try {
        await adminUser.save();
        console.log('✅ Admin user created.');
      } catch (err) {
        console.error('❌ Error saving admin:', err);
      }
    } else {
      console.log('ℹ️ Admin already exists.');
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
