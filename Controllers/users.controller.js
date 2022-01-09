const { response } = require('express');
const bcryptjs = require('bcryptjs');
// the first letter of the constant is Upper case to not crash with the constant
const { User } = require('../models');

const usersGet = async (req, res = response) => {
	const { limit = 8, from = 0 } = req.query;
	const query = { state: true };

	// on the array destructuring when we use the primise.all() is not important which one anwer first
	// it will always respect the order how you declare the promise
	try {
		const [users, usersTotalCounter] = await Promise.all([
			User.find(query).skip(Number(from)).limit(Number(limit)),
			User.countDocuments(query),
		]);
		res.json({ usersTotalCounter, users });
	} catch (error) {
		console.log(error);
	}
};

const userPost = async (req, res = response) => {
	try {
		const { name, email, password, img, role } = req.body;

		// Creation of the instance, set values as default
		const user = new User({ name, email, password, img, role });

		// Hash of th epassword
		const salt = bcryptjs.genSaltSync(5); //by default is 10 and is a good number
		user.password = bcryptjs.hashSync(password, salt);

		// Database save
		await user.save();

		res.status(201).json(user);
	} catch (error) {
		console.log(error);
	}
};

const userPut = async (req, res = response) => {
	const { id } = req.params;
	const { _id, password, google, email, ...rest } = req.body;
	// validations
	if (password) {
		const salt = bcryptjs.genSaltSync(5);
		rest.password = bcryptjs.hashSync(password, salt);
	}

	try {
		const user = await User.findByIdAndUpdate(id, rest, { new: true });

		res.json({ id, user });
	} catch (error) {
		console.log(error);
	}
};

const userPatch = (req, res = response) => {
	res.json({ message: 'Register updated with patch' });
};

const userDelete = async (req, res = response) => {
	const { id } = req.params;
	try {
		// Erase phisicaly from the database, this is not recomended in order to don't lose the reference integrity
		// const user = await User.findByIdAndDelete(id);
		const user = await User.findByIdAndUpdate(
			id,
			{ state: false },
			{ new: true } // This way you can see the changes reflected on the JSON response
		);
		res.json(user);
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	usersGet,
	userPut,
	userPatch,
	userPost,
	userDelete,
};
