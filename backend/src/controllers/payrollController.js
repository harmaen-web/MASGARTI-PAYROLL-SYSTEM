import Employee from '../models/Employee.js';
import Payroll from '../models/Payroll.js';

const calculatePayroll = (employee) => {
  const gross_salary = employee.basic_salary + employee.allowances;
  const net_salary = gross_salary - employee.deductions;
  return { gross_salary, net_salary };
};

export const processPayroll = async (req, res) => {
  try {
    const { employeeId, month, status = 'Processed' } = req.body;

    if (!employeeId || !month) {
      return res.status(400).json({
        success: false,
        message: 'Employee and payroll month are required',
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const existing = await Payroll.findOne({ employee_id: employeeId, month });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Payroll for ${employee.name} in ${month} has already been processed`,
        data: existing,
      });
    }

    const { gross_salary, net_salary } = calculatePayroll(employee);

    const payroll = await Payroll.create({
      employee_id: employeeId,
      month,
      basic_salary: employee.basic_salary,
      allowances: employee.allowances,
      gross_salary,
      deductions: employee.deductions,
      net_salary,
      status,
      processed_date: new Date(),
    });

    const populated = await Payroll.findById(payroll._id).populate('employee_id');
    res.status(201).json({
      success: true,
      message: 'Payroll processed successfully',
      data: populated,
      calculation: {
        basic_salary: employee.basic_salary,
        allowances: employee.allowances,
        gross_salary,
        deductions: employee.deductions,
        net_salary,
      },
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
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const { gross_salary, net_salary } = calculatePayroll(employee);
    res.json({
      success: true,
      data: {
        employee,
        basic_salary: employee.basic_salary,
        allowances: employee.allowances,
        gross_salary,
        deductions: employee.deductions,
        net_salary,
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
    if (status && status !== 'All') filter.status = status;

    let payrolls = await Payroll.find(filter)
      .populate('employee_id')
      .sort({ processed_date: -1 });

    if (search) {
      const term = search.toLowerCase();
      payrolls = payrolls.filter((record) => {
        const employee = record.employee_id;
        if (!employee) return false;
        return (
          employee.name.toLowerCase().includes(term) ||
          employee.employee_id.toLowerCase().includes(term)
        );
      });
    }

    res.json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payroll history', error: error.message });
  }
};

export const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate('employee_id');
    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }
    res.json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payroll record', error: error.message });
  }
};
