import {Router} from 'express'
import {  createUser, deleteUser, getUser,updateUser  } from '../Controllers/UserController.js';


const router = Router();

router.get("/:id",getUser);
router.post("/",createUser);
router.put("/:id",updateUser);
router.delete("/:id",deleteUser);


export default router;