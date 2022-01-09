const mongoose = require('mongoose');

const dbCNN = async () => {
	try {
		await mongoose.connect(
			process.env.MONGODB_ATLAS,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
			(err, resp) => {
				if (err) throw err;
				console.log('Database ONLINE');
			}
		);
	} catch (error) {
		console.log(error);
		throw new Error('Database FALLIURE');
	}
};

module.exports = {
	dbCNN,
};
