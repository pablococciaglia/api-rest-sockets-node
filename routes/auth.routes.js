const { Router } = require('express');
const { check } = require('express-validator');
const {
	login,
	googleSignIn,
	refreshTocken,
} = require('../Controllers/auth.controller');
const { fieldValidator, jwtValidator } = require('../middlewares');

const router = Router();

router.post(
	'/login',
	[
		check('email', 'The email is required').not().isEmpty(),
		check('email', 'The email is not valid').isEmail(),
		check('password', 'Password is required').not().isEmpty(),
		check('password', 'Password at least should have 8 characters').isLength({
			min: 8,
		}),
		fieldValidator,
	],
	login
);

router.post(
	'/google',
	[
		check('id_token', 'Google token is required').not().isEmpty(),
		fieldValidator,
	],
	googleSignIn
);

router.get('/', [jwtValidator, fieldValidator], refreshTocken);

module.exports = router;
