import mongoose from 'mongoose';

export const isValidObjectId = (id) =>
  Boolean(id) && mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);

export const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const PAYROLL_STATUSES = ['Pending', 'Processed', 'Paid'];

export const calculatePayroll = (employee) => {
  const basic = Number(employee.basic_salary) || 0;
  const allowances = Number(employee.allowances) || 0;
  const deductions = Number(employee.deductions) || 0;
  const gross_salary = basic + allowances;
  const net_salary = gross_salary - deductions;
  return { basic_salary: basic, allowances, deductions, gross_salary, net_salary };
};
