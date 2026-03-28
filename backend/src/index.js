import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Connect to Database
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'HopeBridge API is running' });
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map