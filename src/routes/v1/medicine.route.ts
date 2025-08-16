import express, { Router } from 'express';
import { authGuard } from '../../middlewares/v1/auth.guard';
import {
    listMedicines,
    addMedicine,
    updateMedicine,
    getMedicine,
    deleteMedicine,
} from '../../controllers/v1/medicine.controller';
import { upload } from '../../middlewares/shared/multer.middleware';

const router = Router();

// ------- protected troutes --------

// get all medicines
router.route('/').get(authGuard, listMedicines);

//add medicine
router.route('/add-medicine').post(authGuard, upload.single('image'), addMedicine);

// update medicine
router.route('/update/:medicineID').patch(authGuard, upload.single('image'), updateMedicine);

// get medicine details by id
router.route('/profile/:medicineID').get(authGuard, getMedicine);

// delete medicine
router.route('/delete/:medicineID').delete(authGuard, deleteMedicine);

export default router;
