const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { googleVerify } = require('../helpers/google-verify');
const { generateJWT } = require('../helpers/jwt-generator');
const { User } = require('../models');

const login = async (req, res = response) => {
	const { email, password } = req.body;
	try {
		// The email exist?
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				msg: 'incorrect user or password - user',
			});
		}
		// The email is still active?
		if (!user.state) {
			return res.status(400).json({
				msg: 'incorrect user or password - state false',
			});
		}

		// Verify password
		const validPassword = bcryptjs.compareSync(password, user.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: `incorrect user or password - password`,
			});
		}

		// Generate JWT
		const token = await generateJWT(user.id);

		res.json({
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'System faliure. Try later or contact with the service manager',
		});
	}
};

const googleSignIn = async (req, res = response) => {
	const { id_token } = req.body;
	try {
		const { email, img, name } = await googleVerify(id_token);
		let user = await User.findOne({ email });
		// If the user doesn't exist
		if (!user) {
			const data = {
				name,
				email,
				img,
				password: 'googleSignIn',
				google: true,
			};
			user = new User(data);
			await user.save();
		}

		// If the user is already blocked
		if (!user.state) {
			return res.status(401).json({
				msg: 'User not authorized, contact the administrator.',
			});
		}

		const token = await generateJWT(user.id);
		res.json({
			token,
			user,
		});
	} catch (error) {
		res.status(400).json({
			msg: 'Not possible to verify the token',
		});
	}
};
const refreshTocken = async (req, res = response) => {
	const { user } = req;
	const token = await generateJWT(user.id);

	res.json({
		user,
		token,
	});
};

module.exports = {
	googleSignIn,
	login,
	refreshTocken,
};
