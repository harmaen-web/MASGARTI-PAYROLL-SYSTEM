import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, Printer } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';
import { downloadPayslipPdf } from '../utils/downloadPayslipPdf';
import '../styles/payslip.css';

const badgeClass = {
  Paid: 'payslip-badge payslip-badge-paid',
  Processed: 'payslip-badge payslip-badge-processed',
  Pending: 'payslip-badge payslip-badge-pending',
  Active: 'payslip-badge payslip-badge-active',
};

export default function Payslip() {
  const { id } = useParams();
  const { currency } = useCurrency();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const payslipRef = useRef(null);

  const loadPayslip = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getPayrollById(id);
      setRecord(response.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to load payslip');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayslip();
  }, [id]);

  const handleDownloadPdf = async () => {
    if (!payslipRef.current || !record) return;

    setDownloading(true);
    try {
      await downloadPayslipPdf(payslipRef.current, {
        employeeId: record.employee_id?.employee_id,
        month: record.month,
      });
      toast.success('Payslip downloaded as PDF');
    } catch (err) {
      toast.error(err.message || 'Failed to download payslip PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingState message="Loading payslip..." />;
  if (error) return <ErrorState message={error} onRetry={loadPayslip} />;

  const employee = record.employee_id;

  return (
    <div>
      <div className="no-print">
        <PageHeader
          title="Employee Payslip"
          subtitle="View, print, or download the employee payslip for the selected payroll period."
          actions={
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={handleDownloadPdf} disabled={downloading} className="btn-secondary">
                <Download size={16} />
                {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
              <button type="button" onClick={() => window.print()} className="btn-secondary">
                <Printer size={16} />
                Print Payslip
              </button>
              <Link to="/payroll/history" className="btn-primary">Back to History</Link>
            </div>
          }
        />
      </div>

      <div ref={payslipRef} id="payslip-content" className="payslip-document">
        <div className="payslip-header">
          <div className="payslip-header-row">
            <div className="payslip-brand">
              <img
                src="/masgarti-logo.svg"
                alt="Masgarti logo"
                crossOrigin="anonymous"
                className="payslip-logo"
              />
              <div>
                <h2 className="payslip-company">The Masgarti Business</h2>
                <p className="payslip-subtitle">Payroll Processing System</p>
              </div>
            </div>
            <div className="payslip-month-block">
              <p className="payslip-month-label">Payslip Month</p>
              <p className="payslip-month-value">{record.month}</p>
            </div>
          </div>
        </div>

        <div className="payslip-details-grid">
          <Detail label="Employee Name" value={employee?.name} />
          <Detail label="Employee ID" value={employee?.employee_id} />
          <Detail label="Department" value={employee?.department} />
          <Detail label="Designation" value={employee?.designation} />
          <Detail label="Processed Date" value={formatDate(record.processed_date)} />
          <div>
            <p className="payslip-detail-label">Payroll Status</p>
            <div className="payslip-status-wrap">
              <span className={badgeClass[record.status] || 'payslip-badge'}>{record.status}</span>
            </div>
          </div>
        </div>

        <div className="payslip-salary-box">
          <h3 className="payslip-salary-title">Salary Breakdown</h3>
          <div className="payslip-salary-rows">
            <Row label="Basic Salary" value={formatCurrency(record.basic_salary, currency)} />
            <Row label="Allowances" value={formatCurrency(record.allowances, currency)} />
            <Row label="Gross Salary" value={formatCurrency(record.gross_salary, currency)} bold />
            <Row label="Deductions" value={formatCurrency(record.deductions, currency)} />
            <div className="payslip-row-divider">
              <Row label="Net Salary" value={formatCurrency(record.net_salary, currency)} bold accent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="payslip-detail-label">{label}</p>
      <p className="payslip-detail-value">{value || '-'}</p>
    </div>
  );
}

function Row({ label, value, bold = false, accent = false }) {
  const valueClass = [
    'payslip-row-value',
    bold ? 'payslip-row-value-bold' : '',
    accent ? 'payslip-row-value-accent' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="payslip-row">
      <span className="payslip-row-label">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
