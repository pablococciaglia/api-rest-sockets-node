const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateJWT = (uid = '') => {
	return new Promise((res, rej) => {
		const payload = { uid };
		jwt.sign(
			payload,
			process.env.JWTKEY,
			{
				expiresIn: '4h', // library jsonwebtoken option to expire the token
			},
			(err, token) => {
				if (err) {
					console.log(err);
					rej('Not able to generate a token');
				} else {
					res(token);
				}
			}
		);
	});
};

const socketCheckJWT = async (token = '') => {
	try {
		if (token.length < 10) {
			return null;
		}

		const { uid } = jwt.verify(token, process.env.JWTKEY);
		const user = await User.findById(uid);
		if (user.state) {
			return user;
		}
		return null;
	} catch (error) {
		return null;
	}
};

module.exports = { generateJWT, socketCheckJWT };
