const { Router } = require('express');
const { check } = require('express-validator');
const {
	createCategory,
	updateCategory,
	getCategory,
	getCategories,
	deleteCategory,
} = require('../Controllers/categories.controller');
const { isAnExistingCategoryId } = require('../helpers/dbValidators');
const { jwtValidator, isAdminRole } = require('../middlewares');
const { fieldValidator } = require('../middlewares/field-validator');

const router = Router();

// Get all the categories - public path
router.get('/', getCategories);

// Get a specific category - public path
router.get(
	'/:id',
	[
		check('id', 'Is not a valid id').isMongoId(),
		check('id').custom(isAnExistingCategoryId),
		fieldValidator,
	],
	getCategory
);

// Create a category - private path - need valid token
router.post(
	'/',
	[
		jwtValidator,
		check('name', 'Name of the category is required').not().isEmpty(),
		check('name', 'Name at least should have 2 letters').isLength({ min: 2 }),
		fieldValidator,
	],
	createCategory
);

// Update a category - private path - need valid token
router.put(
	'/:id',
	[
		jwtValidator,
		check('id', 'Is not a valid id').isMongoId(),
		check('id').custom(isAnExistingCategoryId),
		check('name', 'Name of the category is required').not().isEmpty(),
		check('name', 'Name at least should have 2 letters').isLength({ min: 2 }),
		fieldValidator,
	],
	updateCategory
);

// Delete a category - private path - need valid token and be Admin
router.delete(
	'/:id',
	[
		jwtValidator,
		isAdminRole,
		check('id', 'Is not a valid id').isMongoId(),
		check('id').custom(isAnExistingCategoryId),
		fieldValidator,
	],
	deleteCategory
);

module.exports = router;
