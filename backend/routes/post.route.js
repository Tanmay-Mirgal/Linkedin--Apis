import {Router} from 'express';
import { protectRoute} from '../middlewares/auth.middleware.js';
import { createPost,deletePost,getFeedPosts,getPostById ,createComment} from '../controllers/post.controller.js';
const router = Router();

router.get('/',protectRoute,getFeedPosts);
router.post('/create',protectRoute,createPost);
router.delete('/delete/:id',protectRoute,deletePost);
router.delete('/:id',protectRoute,getPostById);
router.delete('/:id/comment',protectRoute,createComment);

export default router;