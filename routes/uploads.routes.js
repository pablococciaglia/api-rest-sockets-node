const { Router } = require('express');
const { check } = require('express-validator');
const {
	uploadFile,
	updateImg,
	updateImgCloudinary,
} = require('../Controllers/uploads.controller');
const { isAnAllowedCollection } = require('../helpers');
const { fieldValidator, filesValidator } = require('../middlewares');

const router = Router();

// To upload a new flie, method POST is used, when you need to replace it PUT is used
// (in theory, but you can use only POST and it will work)
router.post('/', [filesValidator, fieldValidator], uploadFile);

router.put(
	'/:collection/:id',
	[
		filesValidator,
		check('id', 'Is not a Mongo ID').isMongoId(),
		check('collection').custom((collection) =>
			isAnAllowedCollection(collection, ['users', 'products'])
		),
		fieldValidator,
	],
	updateImgCloudinary
	// updateImg
);

module.exports = router;
