import Employee from '../models/Employee.js';
import Payroll from '../models/Payroll.js';
import { escapeRegex, isValidObjectId } from '../utils/helpers.js';

const validateEmployeePayload = (body, isUpdate = false) => {
  const errors = [];
  const fields = ['employee_id', 'name', 'department', 'designation', 'basic_salary', 'allowances', 'deductions'];

  if (!isUpdate) {
    fields.forEach((field) => {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        errors.push(`${field.replace('_', ' ')} is required`);
      }
    });
  }

  if (body.employee_id !== undefined && !String(body.employee_id).trim()) {
    errors.push('Employee ID is required');
  }

  if (body.name !== undefined && !String(body.name).trim()) {
    errors.push('Employee name is required');
  }

  ['basic_salary', 'allowances', 'deductions'].forEach((field) => {
    if (body[field] !== undefined) {
      const value = Number(body[field]);
      if (Number.isNaN(value)) {
        errors.push(`${field.replace('_', ' ')} must be a valid number`);
      } else if (value < 0) {
        errors.push(`${field.replace('_', ' ')} cannot be negative`);
      }
    }
  });

  const basic = body.basic_salary !== undefined ? Number(body.basic_salary) : undefined;
  const allowances = body.allowances !== undefined ? Number(body.allowances) : undefined;
  const deductions = body.deductions !== undefined ? Number(body.deductions) : undefined;

  if (
    basic !== undefined &&
    allowances !== undefined &&
    deductions !== undefined &&
    !Number.isNaN(basic) &&
    !Number.isNaN(allowances) &&
    !Number.isNaN(deductions) &&
    deductions > basic + allowances
  ) {
    errors.push('Deductions cannot exceed gross salary (basic salary + allowances)');
  }

  return errors;
};

export const getEmployees = async (req, res) => {
  try {
    const { search, department, designation, min_salary, max_salary } = req.query;
    const filter = {};

    if (search) {
      const term = escapeRegex(search.trim());
      filter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { employee_id: { $regex: term, $options: 'i' } },
        { department: { $regex: term, $options: 'i' } },
        { designation: { $regex: term, $options: 'i' } },
      ];
    }

    if (department && department !== 'All') {
      filter.department = department;
    }

    if (designation && designation !== 'All') {
      filter.designation = designation;
    }

    if (min_salary || max_salary) {
      const minValue = min_salary === undefined || min_salary === '' ? undefined : Number(min_salary);
      const maxValue = max_salary === undefined || max_salary === '' ? undefined : Number(max_salary);

      if ((min_salary && Number.isNaN(minValue)) || (max_salary && Number.isNaN(maxValue))) {
        return res.status(400).json({ success: false, message: 'Salary filters must be valid numbers' });
      }

      if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
        return res.status(400).json({ success: false, message: 'Minimum salary cannot be greater than maximum salary' });
      }

      filter.basic_salary = {};
      if (minValue !== undefined) filter.basic_salary.$gte = minValue;
      if (maxValue !== undefined) filter.basic_salary.$lte = maxValue;
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employees', error: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employee', error: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const errors = validateEmployeePayload(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const existing = await Employee.findOne({ employee_id: req.body.employee_id.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Employee ID already exists' });
    }

    const employee = await Employee.create({
      employee_id: req.body.employee_id.trim(),
      name: req.body.name.trim(),
      department: req.body.department.trim(),
      designation: req.body.designation.trim(),
      basic_salary: Number(req.body.basic_salary),
      allowances: Number(req.body.allowances),
      deductions: Number(req.body.deductions),
    });

    res.status(201).json({ success: true, message: 'Employee created successfully', data: employee });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Employee ID already exists' });
    }
    res.status(500).json({ success: false, message: 'Failed to create employee', error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }

    const errors = validateEmployeePayload(req.body, true);
    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const nextBasic = req.body.basic_salary !== undefined ? Number(req.body.basic_salary) : employee.basic_salary;
    const nextAllowances = req.body.allowances !== undefined ? Number(req.body.allowances) : employee.allowances;
    const nextDeductions = req.body.deductions !== undefined ? Number(req.body.deductions) : employee.deductions;

    if (nextDeductions > nextBasic + nextAllowances) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Deductions cannot exceed gross salary (basic salary + allowances)'],
      });
    }

    if (req.body.employee_id !== undefined) {
      const nextEmployeeId = String(req.body.employee_id).trim();
      if (nextEmployeeId && nextEmployeeId !== employee.employee_id) {
        const duplicate = await Employee.findOne({ employee_id: nextEmployeeId });
        if (duplicate) {
          return res.status(409).json({ success: false, message: 'Employee ID already exists' });
        }
        employee.employee_id = nextEmployeeId;
      }
    }

    if (req.body.name !== undefined) employee.name = req.body.name.trim();
    if (req.body.department !== undefined) employee.department = req.body.department.trim();
    if (req.body.designation !== undefined) employee.designation = req.body.designation.trim();
    if (req.body.basic_salary !== undefined) employee.basic_salary = nextBasic;
    if (req.body.allowances !== undefined) employee.allowances = nextAllowances;
    if (req.body.deductions !== undefined) employee.deductions = nextDeductions;

    await employee.save();
    res.json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update employee', error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid employee ID' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    await Payroll.deleteMany({ employee_id: employee._id });
    await employee.deleteOne();

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete employee', error: error.message });
  }
};
