const { Category, Role, User, Product } = require('../models');

/**
 * Validate if is one of the available roles
 */
const isValidRole = async (role = '') => {
	const isExistingRole = await Role.findOne({ role });
	if (!isExistingRole) {
		throw new Error(`the role ${role} is not registered in the database`);
	}
};

/**
 * Verify if the email exist
 */
const isRepeatedEmail = async (email = '') => {
	const existEmail = await User.findOne({ email });
	if (existEmail) {
		throw new Error(`${email} is already registered`);
	}
};

/**
 * Verify if the id of the user exist
 */
const isAnExistingId = async (id) => {
	const existId = await User.findById(id);
	if (!existId) {
		throw new Error(`${id} is not valid`);
	}
};

/**
 * Verify if the id of the category exist
 */
const isAnExistingCategoryId = async (id) => {
	const existId = await Category.findById(id);
	if (!existId) {
		throw new Error(`${id} is not valid`);
	}
};

/**
 * Verify if the id of the product exist
 */
const isAnExistingProductId = async (id) => {
	const existId = await Product.findById(id);
	if (!existId) {
		throw new Error(`${id} is not valid`);
	}
};

/**
 * Validate allowed collections
 */
const isAnAllowedCollection = (collection = '', collections = []) => {
	const isIncluded = collections.includes(collection);
	if (!isIncluded) {
		throw new Error(`The collection ${collection} is not allowed`);
	}

	return true;
};

module.exports = {
	isAnAllowedCollection,
	isAnExistingId,
	isAnExistingCategoryId,
	isAnExistingProductId,
	isRepeatedEmail,
	isValidRole,
};
