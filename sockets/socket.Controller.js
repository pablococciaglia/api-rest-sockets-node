const { Socket } = require('socket.io');
const { socketCheckJWT } = require('../helpers');
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();
// To create the instance of new Socket here is just to speed up
// the developing, but there is necessary to erase it when we push it on production
const socketController = async (socket = new Socket(), io) => {
	const token = socket.handshake.headers['authorization'];
	const user = await socketCheckJWT(token);
	if (!user) {
		return socket.disconnect();
	}

	// When the user connect
	chatMessages.connectUser(user);
	io.emit('active-users', chatMessages.usersArr); // Doing a io.emit we dont need to do socket.emit, and socket.broadcast.emit
	socket.emit('recive-messages', chatMessages.last10);

	// Connect the user to a special room just for its own user.id to recive personal messages
	socket.join(user.id);

	// Clean the disconnected users
	socket.on('disconnect', () => {
		chatMessages.disconnectUser(user.id);
	});
	socket.on('send-messages', ({ message, uid }) => {
		if (uid) {
			socket.to(uid).emit('private-messages', { from: user.name, message });
		} else {
			chatMessages.sendMessages(user.id, user.name, message);
			io.emit('recive-messages', chatMessages.last10);
		}
	});
};

module.exports = {
	socketController,
};
