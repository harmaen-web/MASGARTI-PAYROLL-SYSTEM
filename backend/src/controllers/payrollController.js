import Employee from '../models/Employee.js';
import Payroll from '../models/Payroll.js';
import { calculatePayroll, isValidObjectId, PAYROLL_STATUSES } from '../utils/helpers.js';

export const processPayroll = async (req, res) => {
  try {
    const { employeeId, month, status = 'Processed' } = req.body;

    if (!employeeId || !month || !String(month).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Employee and payroll month are required',
      });
    }

    if (!isValidObjectId(employeeId)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }

    if (!PAYROLL_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Payroll status must be Pending, Processed, or Paid',
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const payrollMonth = String(month).trim();
    const existing = await Payroll.findOne({ employee_id: employeeId, month: payrollMonth });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Payroll for ${employee.name} in ${payrollMonth} has already been processed`,
        data: existing,
      });
    }

    const calculation = calculatePayroll(employee);
    if (calculation.net_salary < 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot process payroll because deductions exceed gross salary',
      });
    }

    const payroll = await Payroll.create({
      employee_id: employeeId,
      month: payrollMonth,
      basic_salary: calculation.basic_salary,
      allowances: calculation.allowances,
      gross_salary: calculation.gross_salary,
      deductions: calculation.deductions,
      net_salary: calculation.net_salary,
      status,
      processed_date: new Date(),
    });

    const populated = await Payroll.findById(payroll._id).populate('employee_id');
    res.status(201).json({
      success: true,
      message: 'Payroll processed successfully',
      data: populated,
      calculation,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Payroll for this employee and month already exists',
      });
    }
    res.status(500).json({ success: false, message: 'Failed to process payroll', error: error.message });
  }
};

export const previewPayroll = async (req, res) => {
  try {
    const { employeeId } = req.query;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee is required' });
    }

    if (!isValidObjectId(employeeId)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const calculation = calculatePayroll(employee);
    res.json({
      success: true,
      data: {
        employee,
        ...calculation,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to preview payroll', error: error.message });
  }
};

export const getPayrollHistory = async (req, res) => {
  try {
    const { search, month, status } = req.query;
    const filter = {};

    if (month) filter.month = month;
    if (status && status !== 'All') {
      if (!PAYROLL_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid payroll status filter' });
      }
      filter.status = status;
    }

    let payrolls = await Payroll.find(filter)
      .populate('employee_id')
      .sort({ processed_date: -1 });

    if (search) {
      const term = search.toLowerCase().trim();
      payrolls = payrolls.filter((record) => {
        const employee = record.employee_id;
        if (!employee) return false;
        const name = String(employee.name || '').toLowerCase();
        const employeeCode = String(employee.employee_id || '').toLowerCase();
        return name.includes(term) || employeeCode.includes(term);
      });
    }

    res.json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payroll history', error: error.message });
  }
};

export const getPayrollById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid payroll ID' });
    }

    const payroll = await Payroll.findById(req.params.id).populate('employee_id');
    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }
    res.json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payroll record', error: error.message });
  }
};
