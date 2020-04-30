import { Router } from 'express';
import { validate } from 'express-validation';

// controllers
import adminCtrl from '../controllers/admin';
import searchCtrl from '../controllers/search';
import tokensCtrl from '../controllers/tokens';
import usersCtrl from '../controllers/users';

// validations
import validations from '../helpers/validations';

const router = Router();

// tokens
router.get('/tokens/app', tokensCtrl.getAppToken);
router.get('/tokens/user', validate(validations.getUserToken), tokensCtrl.getUserToken);

// user account
router.get('/myAccount', validate(validations.getAccountInfo), usersCtrl.getAccountInfo);

// search
router.get('/search/restaurants', validate(validations.getRestaurants), searchCtrl.getRestaurants);

// admin
router.get('/admin/stats', validate(validations.getStats), adminCtrl.getStats);

export default router;
