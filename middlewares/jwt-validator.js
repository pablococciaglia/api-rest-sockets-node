const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtValidator = async (req = request, res = response, next) => {
	const token = req.header('authorization');
	if (!token) {
		return res.status(401).json({
			msg: 'There is no token in the request',
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.JWTKEY);

		// Find the uid owner
		const user = await User.findById(uid);
		// Check if the user exist
		if (!user) {
			return res.status(401).json({
				msg: 'Invalid token - The user do not exist',
			});
		}
		// Check if the state is active
		if (!user.state) {
			return res.status(401).json({
				msg: 'Invalid token - The user is not active',
			});
		}

		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({
			msg: 'Not valid token',
		});
	}
};

module.exports = { jwtValidator };
