// src/index.ts
import './loadEnv.js'; // ✅ Ensures environment variables are loaded before anything else
import app from './app.js';

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}...`);
});
