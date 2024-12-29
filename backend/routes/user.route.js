import {Router} from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getSuggestedConnections,updateProfile ,getPublicProfile} from "../controllers/user.controller.js";

const router = Router();

router.get('/suggestions',protectRoute,getSuggestedConnections);
router.get('/:username',protectRoute,getPublicProfile);
router.put('/profile',protectRoute,updateProfile);


export default Router;