import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import EmployeeForm from '../components/EmployeeForm';
import { api } from '../services/api';

export default function AddEmployee() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      await api.createEmployee(payload);
      toast.success('Employee added successfully');
      navigate('/employees', { state: { message: 'Employee added successfully' } });
    } catch (err) {
      toast.error(err.data?.message || err.message || 'Failed to add employee');
      throw err;
    }
  };

  return (
    <div>
      <PageHeader title="Add Employee" subtitle="Create a new employee record for payroll processing." />
      <EmployeeForm submitLabel="Add Employee" onSubmit={handleSubmit} onCancel={() => navigate('/employees')} />
    </div>
  );
}
