const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const { User, Category, Product } = require('../models');

const allowedCollections = ['categories', 'products', 'users'];

const searchUsers = async (query = '', res = response) => {
	const isMongoId = isValidObjectId(query);
	try {
		if (isMongoId) {
			const user = await User.findById(query);
			return res.json({
				results: user ? [user] : [],
			});
		}

		const regex = new RegExp(query, 'i');

		const users = await User.find({
			$or: [{ name: regex }, { email: regex }],
			$and: [{ state: true }],
		});

		res.json({
			results: users,
		});
	} catch (error) {
		console.log(error);
	}
};

const searchProducts = async (query = '', res = response) => {
	const isMongoId = isValidObjectId(query);
	try {
		if (isMongoId) {
			const product = await Product.findById(query).populate(
				'category',
				'name'
			);

			return res.json({
				results: product ? [product] : [],
			});
		}

		const regex = new RegExp(query, 'i');

		const products = await Product.find({ name: regex, state: true }).populate(
			'category',
			'name'
		);

		res.json({
			results: products,
		});
	} catch (error) {
		console.log(error);
	}
};

const searchCategories = async (query = '', res = response) => {
	const isMongoId = isValidObjectId(query);
	try {
		if (isMongoId) {
			const category = await Category.findById(query);
			return res.json({
				results: category ? [category] : [],
			});
		}

		const regex = new RegExp(query, 'i');

		const categories = await Category.find({ name: regex, state: true });

		res.json({
			results: categories,
		});
	} catch (error) {
		console.log(error);
	}
};

const search = (req, res = response) => {
	const { collection, query } = req.params;
	if (!allowedCollections.includes(collection)) {
		return res.status(400).json({
			msg: `the collection allowed are ${allowedCollections}`,
		});
	}

	switch (collection) {
		case 'categories':
			searchCategories(query, res);
			break;
		case 'products':
			searchProducts(query, res);
			break;
		case 'users':
			searchUsers(query, res);
			break;

		default:
			res.status(500).json({
				msg: 'The server fail, try again later',
			});
			break;
	}
};

module.exports = { search };
