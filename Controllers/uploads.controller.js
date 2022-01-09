const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { uploadFiles } = require('../helpers');
const { User, Product } = require('../models');

const uploadFile = async (req, res = response) => {
	try {
		const name = await uploadFiles(req.files, undefined, 'imgs');

		res.json({
			name,
		});
	} catch (msg) {
		res.status(400).json({ msg });
	}
};

const updateImg = async (req, res = response) => {
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

		// Clean previous image
		if (model.img) {
			const pathImage = path.join(
				__dirname,
				'../uploads',
				collection,
				model.img
			);

			if (fs.existsSync(pathImage)) {
				fs.unlinkSync(pathImage);
			}
		}

		const name = await uploadFiles(req.files, undefined, collection);

		model.img = name;

		await model.save();

		res.json(model);
	} catch (err) {
		res.status(500).json({ msg: 'Internal server error, try later' });
	}
};

const updateImgCloudinary = async (req, res = response) => {
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

		// Clean previous image
		if (model.img) {
			const nameArr = model.img.split('/');
			const name = nameArr[nameArr.length - 1];
			const [public_id] = name.split('.');
			cloudinary.uploader.destroy(public_id);
		}

		const { tempFilePath } = req.files.file;

		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

		model.img = secure_url;

		await model.save();

		res.json(model);
	} catch (err) {
		res.status(500).json({ msg: 'Internal server error, try later' });
	}
};

module.exports = {
	updateImg,
	updateImgCloudinary,
	uploadFile,
};
