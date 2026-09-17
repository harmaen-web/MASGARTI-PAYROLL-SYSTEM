import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from './models/Admin.js';

dotenv.config();

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    return;
  } catch (error) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
  }
};

const seedAdmin = async () => {
  try {
    await connectDatabase();

    const email = (process.env.ADMIN_EMAIL || 'admin@masgarti.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const name = process.env.ADMIN_NAME || 'HR Administrator';

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: hashedPassword, name, role: 'Administrator' });
    console.log('Admin seeded successfully:', email);
    process.exit(0);
  } catch (error) {
    console.error('Admin seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
