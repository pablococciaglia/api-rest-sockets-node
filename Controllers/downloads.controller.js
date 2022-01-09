const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { User, Product } = require('../models');

const downloadImg = async (req, res = response) => {
	try {
		const { collection, id } = req.params;

		let model;
		switch (collection) {
			case 'users':
				model = await User.findById(id);
				if (!model) {
					return res.status(400).json({
						msg: `The user with id: '${id}' does not exist`,
					});
				}
				break;

			case 'products':
				model = await Product.findById(id);
				if (!model) {
					return res.status(400).json({
						msg: `The product with id: '${id}' does not exist`,
					});
				}
				break;

			default:
				return res
					.status(500)
					.json({ msg: 'Internal server error, try later' });
				break;
		}

		// Return the image in case that exist
		if (model.img) {
			const pathImage = path.join(
				__dirname,
				'../uploads',
				collection,
				model.img
			);

			if (fs.existsSync(pathImage)) {
				return res.sendFile(pathImage);
			}
		}

		// If dont exist an image return the picture of image not found
		const pathImage = path.join(__dirname, '../assets', 'no-image.jpg');

		res.sendFile(pathImage);
	} catch (err) {
		res.status(500).json({ msg: 'Internal server error, try later' });
	}
};

const downloadImgCloudinary = async (req, res = response) => {
	try {
		const { collection, id } = req.params;

		let model;
		switch (collection) {
			case 'users':
				model = await User.findById(id);
				if (!model) {
					return res.status(400).json({
						msg: `The user with id: '${id}' does not exist`,
					});
				}
				break;

			case 'products':
				model = await Product.findById(id);
				if (!model) {
					return res.status(400).json({
						msg: `The product with id: '${id}' does not exist`,
					});
				}
				break;

			default:
				return res
					.status(500)
					.json({ msg: 'Internal server error, try later' });
				break;
		}

		// Return the coudinary's url of theimage in case that exist
		if (model.img) {
			res.json({ url: model.img });
		}

		// If dont exist an image return the picture of image not found
		const pathImage = path.join(__dirname, '../assets', 'no-image.jpg');

		res.sendFile(pathImage);
	} catch (err) {
		res.status(500).json({ msg: 'Internal server error, try later' });
	}
};

module.exports = {
	downloadImg,
	downloadImgCloudinary,
};
