const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
	name: {
		type: String,
		required: [true, 'name is required'],
	},
	state: {
		type: Boolean,
		default: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'the user is required'],
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: [true, 'the category is required'],
	},
	cost: {
		type: Number,
		default: 0,
	},
	description: {
		type: String,
		required: [true, 'the description is required'],
	},
	img: {
		type: String,
	},
	quantity: {
		type: Number,
	},
});

ProductSchema.methods.toJSON = function () {
	const { __v, state, _id, ...category } = this.toObject();

	return category;
};

module.exports = model('Product', ProductSchema);
