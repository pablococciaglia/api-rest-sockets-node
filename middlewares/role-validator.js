const { response } = require('express');

const isAdminRole = (req, res = response, next) => {
	if (!req.user) {
		return res.status(500).json({
			msg: 'Token need to be validated first',
		});
	}
	const { role, name } = req.user;
	if (role !== 'ADMIN_ROLE') {
		return res.status(401).json({
			msg: `${name} has not administrator permission to do this action`,
		});
	}
	next();
};

const hasRole =
	(...roles) =>
	(req, res = response, next) => {
		if (!req.user) {
			return res.status(500).json({
				msg: 'Token need to be validated first',
			});
		}
		const { role, name } = req.user;

		if (!roles.includes(role)) {
			return res.status(401).json({
				msg: `${name} has not permission to do this action`,
			});
		}
		next();
	};

module.exports = {
	isAdminRole,
	hasRole,
};
