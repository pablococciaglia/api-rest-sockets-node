const { response } = require('express');
const { Product } = require('../models');

const createProduct = async (req, res = response) => {
	try {
		const { state, user, ...body } = req.body;
		body.name = body.name.toUpperCase();

		// Find if the product already exist
		const productExist = await Product.findOne({ name: body.name });

		if (productExist) {
			return res.status(400).json({
				msg: `This product ${name} already exist`,
			});
		}

		// Generate data for the Database
		const data = {
			...body,
			user: req.user._id,
		};

		// Creation of the instance, set values as default
		const product = new Product(data);

		// Database save
		await product.save();

		res.status(201).json(product);
	} catch (error) {
		return res.json({
			msg: 'Talk with the App Admin',
		});
	}
};

const updateProduct = async (req, res = response) => {
	const { id } = req.params;
	try {
		const { user, state, ...data } = req.body;

		if (data.name) {
			data.name = data.name.toUpperCase();
		}
		data.user = req.user._id;

		// Creation of the instance, set values as default
		const product = await Product.findByIdAndUpdate(id, data, {
			new: true,
		});

		res.status(200).json(product);
	} catch (error) {
		return res.json({
			msg: 'Talk with the App Admin',
		});
	}
};

const getProducts = async (req, res = response) => {
	const { limit = 8, from = 0 } = req.query;
	const query = { state: true };
	try {
		// on the array destructuring when we use the primise.all() is not important which one anwer first
		// it will always respect the order how you declare the promise
		const [products, productsTotalCounter] = await Promise.all([
			Product.find(query)
				.skip(Number(from))
				.limit(Number(limit))
				.populate('user', 'name') // Method populate shows who create the register
				.populate('category', 'name'),
			Product.countDocuments(query),
		]);
		res.status(200).json({ productsTotalCounter, products });
	} catch (error) {
		return res.json({
			msg: 'Talk with the App Admin',
		});
	}
};

const getProduct = async (req, res = response) => {
	const { id } = req.params;
	try {
		const product = await Product.findById(id)
			.populate('user', 'name')
			.populate('category', 'name');
		if (!product.state) {
			return res.status(401).json({
				msg: 'This product is not longer available',
			});
		}

		res.status(200).json(product);
	} catch (error) {
		return res.json({
			msg: 'Talk with the App Admin',
		});
	}
};

const deleteProduct = async (req, res = response) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndUpdate(
			id,
			{ state: false },
			{ new: true }
		);
		res.status(200).json(product);
	} catch (error) {
		return res.json({
			msg: 'Talk with the App Admin',
		});
	}
};

module.exports = {
	createProduct,
	deleteProduct,
	getProducts,
	getProduct,
	updateProduct,
};
