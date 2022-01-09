const filesValidator = (req, res, next) => {
	if (!req.files || !req.files.file || Object.keys(req.files).length === 0) {
		return res.status(400).json({ msg: 'No files were uploaded.' });
	}
	next();
};

module.exports = {
	filesValidator,
};
