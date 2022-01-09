const { Router } = require('express');
const { check } = require('express-validator');
const {
	usersGet,
	userPut,
	userDelete,
	userPost,
	userPatch,
} = require('../Controllers/users.controller');
const {
	isValidRole,
	isRepeatedEmail,
	isAnExistingId,
} = require('../helpers/dbValidators');
const {
	fieldValidator,
	isAdminRole,
	hasRole,
	jwtValidator,
} = require('../middlewares');

const router = Router();

router.get('/', usersGet);

// If you got only 2 arguments the second one is controller. but
//if you got 3 argument the middle one is a middleware and is executed bofore the controller.
router.post(
	'/',
	[
		check('email', 'The email is required').not().isEmpty(),
		check('email', 'The email is not valid').isEmail(),
		check('email').custom(isRepeatedEmail),
		check('name', 'Name is required').not().isEmpty(),
		check('name', 'Name at least should have 2 letters').isLength({ min: 2 }),
		check('password', 'Password is required').not().isEmpty(),
		check('password', 'Password at least should have 8 characters').isLength({
			min: 8,
		}),
		check('role', 'Role is required').not().isEmpty(),
		// check('role', 'Is not a valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
		check('role').custom(isValidRole),
		fieldValidator,
	],
	userPost
);

router.put(
	'/:id',
	[
		check('id', 'Is not a valid id').isMongoId(),
		check('id').custom(isAnExistingId),
		check('role').custom(isValidRole),
		fieldValidator,
	],
	userPut
);

router.patch('/', userPatch);

router.delete(
	'/:id',
	[
		jwtValidator,
		hasRole('ADMIN_ROLE', 'SALES_ROLE'),
		// isAdminRole,
		check('id', 'Is not a valid id').isMongoId(),
		check('id').custom(isAnExistingId),
		fieldValidator,
	],
	userDelete
);

module.exports = router;
