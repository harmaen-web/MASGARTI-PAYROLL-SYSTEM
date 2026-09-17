import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    basic_salary: {
      type: Number,
      required: [true, 'Basic salary is required'],
      min: [0, 'Basic salary cannot be negative'],
    },
    allowances: {
      type: Number,
      required: [true, 'Allowances are required'],
      min: [0, 'Allowances cannot be negative'],
      default: 0,
    },
    deductions: {
      type: Number,
      required: [true, 'Deductions are required'],
      min: [0, 'Deductions cannot be negative'],
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Employee', employeeSchema);
