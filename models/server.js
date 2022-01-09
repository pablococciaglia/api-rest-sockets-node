const express = require('express');
let cors = require('cors');
const { dbCNN } = require('../database/config');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const { socketController } = require('../sockets/socket.Controller');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = createServer(this.app);
		this.io = require('socket.io')(this.server);

		this.paths = {
			auth: '/api/auth',
			categories: '/api/categories',
			products: '/api/products',
			search: '/api/search',
			user: '/api/user',
			uploads: '/api/uploads',
			downloads: '/api/downloads',
		};

		// Database connect
		this.dbConnection();
		// Middlewares
		this.middlewares();
		// Routes of my app
		this.routes();
		// Sockets
		this.sockets();
	}

	async dbConnection() {
		await dbCNN();
	}

	middlewares() {
		// Public directory
		this.app.use(express.static('public')); // El use() indica que es un middleware

		// Parse and body reader
		this.app.use(express.json());

		// CORS
		this.app.use(cors());

		// to upload Files
		this.app.use(
			fileUpload({
				createParentPath: true, // it will create the complete path in case that the folder doent exist, by default is in false (could be dangerous)
				useTempFiles: true,
				tempFileDir: '/tmp/',
				createParentPath: true,
			})
		);
	}

	routes() {
		this.app.use(this.paths.auth, require('../routes/auth.routes'));
		this.app.use(this.paths.categories, require('../routes/categories.routes'));
		this.app.use(this.paths.products, require('../routes/products.routes'));
		this.app.use(this.paths.search, require('../routes/search.routes'));
		this.app.use(this.paths.user, require('../routes/user.routes'));
		this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
		this.app.use(this.paths.downloads, require('../routes/downloads.routes'));
	}

	sockets() {
		this.io.on('connection', (socket) => socketController(socket, this.io));
	}

	listen() {
		this.server.listen(this.port, () => {
			console.log('Server in port,', this.port);
		});
	}
}
module.exports = Server;
