const dotenv = require('dotenv');
dotenv.config();

// Check if required environment variables are set
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    console.error('Missing environment variables');
    console.error('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.error('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    process.exit(1); // Exit the process with a non-zero code to indicate failure
}

// Continue with the rest of your setup
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const recRoutes = require('./routes/recommendations');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Use auth routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/recommendations',  recRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
