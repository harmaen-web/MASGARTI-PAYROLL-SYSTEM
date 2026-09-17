import { Router } from 'express';
import {
  getPayrollById,
  getPayrollHistory,
  previewPayroll,
  processPayroll,
} from '../controllers/payrollController.js';

const router = Router();

router.get('/history', getPayrollHistory);
router.get('/preview', previewPayroll);
router.post('/process', processPayroll);
router.get('/:id', getPayrollById);

export default router;
