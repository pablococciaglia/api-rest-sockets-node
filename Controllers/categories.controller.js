const { response } = require('express');
const { Category } = require('../models');

const createCategory = async (req, res = response) => {
	try {
		const name = req.body.name.toUpperCase();

		// Find if the category already exist
		const categoryExist = await Category.findOne({ name });

		if (categoryExist) {
			return res.status(400).json({
				msg: `This category ${name} already exist`,
			});
		}

		// Generate data for the Database
		const data = {
			name,
			user: req.user._id,
		};

		// Creation of the instance, set values as default
		const category = new Category(data);

		// Database save
		await category.save();

		res.status(201).json(category);
	} catch (error) {
		return res.json({
			msg: 'Talk with the App Admin',
		});
	}
};

const updateCategory = async (req, res = response) => {
	const { id } = req.params;
	try {
		const { user, state, ...data } = req.body;
		data.name = data.name.toUpperCase();
		data.user = req.user._id;

		// Creation of the instance, set values as default
		const category = await Category.findByIdAndUpdate(id, data, {
			new: true,
		});

		res.status(200).json(category);
	} catch (error) {
		return res.json({
			msg: 'Talk with the App Admin',
		});
	}
};

const getCategories = async (req, res = response) => {
	const { limit = 8, from = 0 } = req.query;
	const query = { state: true };
	try {
		// on the array destructuring when we use the primise.all() is not important which one anwer first
		// it will always respect the order how you declare the promise
		const [categories, categoriesTotalCounter] = await Promise.all([
			Category.find(query)
				.skip(Number(from))
				.limit(Number(limit))
				.populate('user', 'name'), // Method populate shows who create the register
			Category.countDocuments(query),
		]);
		res.status(200).json({ categoriesTotalCounter, categories });
	} catch (error) {
		return res.json({
			msg: 'Talk with the App Admin',
		});
	}
};

const getCategory = async (req, res = response) => {
	const { id } = req.params;
	try {
		const category = await Category.findById(id).populate('user', 'name');
		if (!category.state) {
			return res.status(401).json({
				msg: 'This category is not longer available',
			});
		}

		res.status(200).json(category);
	} catch (error) {
		return res.json({
			msg: 'Talk with the App Admin',
		});
	}
};

const deleteCategory = async (req, res = response) => {
	try {
		const { id } = req.params;
		const category = await Category.findByIdAndUpdate(
			id,
			{ state: false },
			{ new: true }
		);
		res.status(200).json(category);
	} catch (error) {
		return res.json({
			msg: 'Talk with the App Admin',
		});
	}
};

module.exports = {
	createCategory,
	deleteCategory,
	getCategories,
	getCategory,
	updateCategory,
};
