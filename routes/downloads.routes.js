const { Router } = require('express');
const { check } = require('express-validator');
const {
	downloadImg,
	downloadImgCloudinary,
} = require('../Controllers/downloads.controller');
const { isAnAllowedCollection } = require('../helpers');
const { fieldValidator } = require('../middlewares');

const router = Router();

router.get(
	'/:collection/:id',
	[
		check('id', 'Is not a Mongo ID').isMongoId(),
		check('collection').custom((collection) =>
			isAnAllowedCollection(collection, ['users', 'products'])
		),
		fieldValidator,
	],
	// downloadImg,
	downloadImgCloudinary
);

module.exports = router;
