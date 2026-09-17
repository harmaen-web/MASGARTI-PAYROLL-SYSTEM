import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee reference is required'],
    },
    month: {
      type: String,
      required: [true, 'Payroll month is required'],
      trim: true,
    },
    basic_salary: {
      type: Number,
      required: true,
      min: 0,
    },
    allowances: {
      type: Number,
      required: true,
      min: 0,
    },
    gross_salary: {
      type: Number,
      required: true,
      min: 0,
    },
    deductions: {
      type: Number,
      required: true,
      min: 0,
    },
    net_salary: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processed', 'Paid'],
      default: 'Processed',
      required: true,
    },
    processed_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

payrollSchema.index({ employee_id: 1, month: 1 }, { unique: true });

export default mongoose.model('Payroll', payrollSchema);
