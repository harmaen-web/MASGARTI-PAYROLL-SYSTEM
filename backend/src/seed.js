import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Employee from './models/Employee.js';

dotenv.config();

const seedEmployees = [
  {
    employee_id: 'EMP001',
    name: 'Ayesha Khan',
    department: 'HR',
    designation: 'HR Executive',
    basic_salary: 30000,
    allowances: 5000,
    deductions: 2000,
  },
  {
    employee_id: 'EMP002',
    name: 'Mohammed Faiz',
    department: 'Finance',
    designation: 'Accountant',
    basic_salary: 28000,
    allowances: 4000,
    deductions: 1800,
  },
  {
    employee_id: 'EMP003',
    name: 'Sana Iqbal',
    department: 'Sales',
    designation: 'Sales Executive',
    basic_salary: 25000,
    allowances: 6000,
    deductions: 1500,
  },
];

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

const seed = async () => {
  try {
    await connectDatabase();
    await Employee.deleteMany({});
    await Employee.insertMany(seedEmployees);
    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
