const { Router } = require('express');
const { check } = require('express-validator');
const {
	createProduct,
	updateProduct,
	getProduct,
	getProducts,
	deleteProduct,
} = require('../Controllers/products.controller');
const {
	isAnExistingCategoryId,
	isAnExistingProductId,
} = require('../helpers/dbValidators');
const { jwtValidator, isAdminRole } = require('../middlewares');
const { fieldValidator } = require('../middlewares/field-validator');

const router = Router();

// Get all the products - public path
router.get('/', getProducts);

// Get a specific product - public path
router.get(
	'/:id',
	[
		check('id', 'Is not a valid id').isMongoId(),
		check('id').custom(isAnExistingProductId),
		fieldValidator,
	],
	getProduct
);

// Create a product - private path - need valid token
router.post(
	'/',
	[
		jwtValidator,
		check('name', 'Name of the product is required').not().isEmpty(),
		check('name', 'Name at least should have 2 letters').isLength({ min: 2 }),
		check('description', 'Description of the product is required')
			.not()
			.isEmpty(),
		check(
			'description',
			'Description at least should have 10 letters'
		).isLength({ min: 10 }),
		check('user', 'The useris required').not().isEmpty(),
		check('category', 'The category is required').isMongoId(),
		check('category').custom(isAnExistingCategoryId),
		fieldValidator,
	],
	createProduct
);

// Update a product - private path - need valid token
router.put(
	'/:id',
	[
		jwtValidator,
		check('id', 'Is not a valid id').isMongoId(),
		check('id').custom(isAnExistingProductId),
		fieldValidator,
	],
	updateProduct
);

// Delete a product - private path - need valid token and be Admin
router.delete(
	'/:id',
	[
		jwtValidator,
		isAdminRole,
		check('id', 'Is not a valid id').isMongoId(),
		check('id').custom(isAnExistingProductId),
		fieldValidator,
	],
	deleteProduct
);

module.exports = router;
