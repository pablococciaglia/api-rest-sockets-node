const path = require('path');
const { v4: uuidv4 } = require('uuid');
uuidv4();

const uploadFiles = (
	files,
	validExtensions = ['jpg', 'png', 'jpeg', 'gif'],
	folder = ''
) => {
	return new Promise((resolve, reject) => {
		const { file } = files;

		// Validate extension
		const splitFile = file.name.split('.');
		const extension = splitFile[splitFile.length - 1];

		if (!validExtensions.includes(extension)) {
			return reject(`"${extension}" is not a valid file extension`);
		}
		const rename = uuidv4() + '.' + extension;

		const uploadPath = path.join(__dirname, '../uploads/', folder, rename);

		file.mv(uploadPath, (err) => {
			if (err) {
				reject(err);
			}

			resolve(rename);
		});
	});
};

module.exports = {
	uploadFiles,
};
