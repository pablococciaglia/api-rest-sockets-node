const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
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
});

CategorySchema.methods.toJSON = function () {
	const { __v, state, _id, ...category } = this.toObject();

	return category;
};

module.exports = model('Category', CategorySchema);
