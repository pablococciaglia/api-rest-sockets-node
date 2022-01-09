const validationField = require('./field-validator');
const validationJWT = require('./jwt-validator');
const validationRoles = require('./role-validator');
const validationFiles = require('./files-validator');

module.exports = {
	...validationField,
	...validationJWT,
	...validationRoles,
	...validationFiles,
};
