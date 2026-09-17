import Employee from '../models/Employee.js';
import Payroll from '../models/Payroll.js';

export const getDashboardStats = async (req, res) => {
  try {
    const { month } = req.query;
    const currentMonth = month || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const totalEmployees = await Employee.countDocuments();
    const monthPayrolls = await Payroll.find({ month: currentMonth });

    const employeesWithPayroll = new Set(monthPayrolls.map((record) => String(record.employee_id))).size;
    const pendingUnprocessed = Math.max(0, totalEmployees - employeesWithPayroll);
    const pendingStatusCount = monthPayrolls.filter((record) => record.status === 'Pending').length;
    const pendingCount = pendingUnprocessed + pendingStatusCount;
    const processedCount = monthPayrolls.filter(
      (record) => record.status === 'Processed' || record.status === 'Paid'
    ).length;
    const totalPayroll = monthPayrolls.reduce((sum, record) => sum + (Number(record.net_salary) || 0), 0);

    const recentActivity = await Payroll.find()
      .populate('employee_id')
      .sort({ processed_date: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        month: currentMonth,
        totalEmployees,
        totalPayroll,
        pendingCount,
        processedCount,
        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
  }
};
