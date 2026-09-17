import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import EmployeeForm from '../components/EmployeeForm';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { api } from '../services/api';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEmployee = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getEmployee(id);
      setEmployee(response.data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to load employee');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const handleSubmit = async (payload) => {
    try {
      await api.updateEmployee(id, payload);
      toast.success('Employee updated successfully');
      navigate('/employees', { state: { message: 'Employee updated successfully' } });
    } catch (err) {
      toast.error(err.data?.message || err.message || 'Failed to update employee');
      throw err;
    }
  };

  if (loading) return <LoadingState message="Loading employee..." />;
  if (error) return <ErrorState message={error} onRetry={loadEmployee} />;

  return (
    <div>
      <PageHeader title="Edit Employee" subtitle="Update employee details and salary information." />
      <EmployeeForm
        initialValues={employee}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/employees')}
      />
    </div>
  );
}
