import express from 'express';
import {updateUser,deleteuser,getUserListings,getUser} from '../controller/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();


router.post('/update/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteuser);
router.get('/listings/:id',verifyToken,getUserListings);
router.get('/:id',verifyToken,getUser)

export default router;