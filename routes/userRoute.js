import {Router} from 'express'
import {  createUser, deleteUser, getUser,updateUser,getAllUsers  } from '../Controllers/UserController.js';


const router = Router();

router.get("/:id",getUser);
router.post("/",createUser);
router.put("/:id",updateUser);
router.delete("/:id",deleteUser);
router.get("/", getAllUsers);



export default router;