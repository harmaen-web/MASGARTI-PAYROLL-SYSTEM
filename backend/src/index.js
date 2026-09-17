import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import dashboardRoutes from './routes/dashboardRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { mountDbViewer } from './dbViewer.js';
import { authMiddleware } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Masgarti Payroll API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/employees', authMiddleware, employeeRoutes);
app.use('/api/payroll', authMiddleware, payrollRoutes);

if (process.env.NODE_ENV !== 'production') {
  mountDbViewer(app);
}

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    return;
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }

    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log('Connected to in-memory MongoDB (development fallback)');
  }
};

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
