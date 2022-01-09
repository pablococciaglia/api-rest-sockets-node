/* {
    name: 'Name Lastname',
    email: 'something@server.com',
    password: 'xxxxx',
    img: 'someurlImage',
    role: 'something',
    state: false,
    google: true/false
} */

const { Schema, model } = require('mongoose');

const UserSchema = Schema({
	name: {
		type: String,
		required: [true, 'Name is a mandatory field'],
	},
	email: {
		type: String,
		required: [true, 'Email is a mandatory field'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Password is a mandatory field'],
	},
	img: {
		type: String,
	},
	role: {
		type: String,
		required: true,
		default: 'USER_ROLE',
		enum: ['ADMIN_ROLE', 'USER_ROLE'],
	},
	state: {
		type: Boolean,
		default: true,
		required: true,
	},
	google: {
		type: Boolean,
		required: false,
	},
});

// To overwrite a function we should only work with a normal function becuase when you use
// "this" the reference is inside itself.
// The method "toJSON" is internally used when you want to return the object into the response
// this is the way to remove __v, and the password on it.
UserSchema.methods.toJSON = function () {
	const { __v, password, _id, ...user } = this.toObject();
	user.uid = _id;

	return user;
};

module.exports = model('User', UserSchema);
