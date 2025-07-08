import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URL as string;

console.log(mongoURI)

if (!mongoURI) {
  throw new Error('MONGODB_URL is not defined in environment variables.');
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err: Error) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

export default mongoose;
