// HTML references
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnExit = document.querySelector('#btnExit');

const url = window.location.hostname.includes('localhost')
	? 'http://localhost:8080/api/auth/'
	: 'https://coffee-store-node.herokuapp.com/api/auth/';

let user = null;
let socket = null;

// Validate the token of localStorage
const validarJWT = async () => {
	const token = localStorage.getItem('token') || '';
	if (token.length < 10) {
		window.location = 'index.html';
		throw new Error('There is no valida Token');
	}
	const resp = await fetch(url, {
		headers: { 'Authorization': token },
	});

	const { user: userDB, token: tokenDB } = await resp.json();

	localStorage.setItem('token', tokenDB);
	user = userDB;
	document.title = user.name;

	await connectSocket();
};

const connectSocket = async () => {
	socket = io({
		'extraHeaders': {
			Authorization: localStorage.getItem('token'),
		},
	});

	socket.on('connect', () => {
		console.log('Sockets onLine');
	});

	socket.on('disconnect', () => {
		console.log('Sockets offLine');
	});

	socket.on('recive-messages', printMessages);

	socket.on('active-users', printUsers);

	socket.on('private-messages', (payload) => {
		console.log({ private: payload });
	});
};

const printUsers = (users = []) => {
	let usersHtml = '';
	users.forEach(({ name, uid }) => {
		usersHtml += `
		<li>
			<p>
				<h5 class="text-success">${name}</h5>
				<span class="fs-6 text-muted">${uid}</span>
			</p>
		</li>`;
	});
	ulUsers.innerHTML = usersHtml;
};

const printMessages = (messages = []) => {
	let messagesHtml = '';
	messages.forEach(({ name, message }) => {
		messagesHtml += `
		<li>
			<p>
				<span class="text-primary">${name}: </span>
				<span>${message}</span>
			</p>
		</li>`;
	});
	ulMessages.innerHTML = messagesHtml;
};

txtMessage.addEventListener('keyup', ({ keyCode }) => {
	const message = txtMessage.value;
	const uid = txtUid.value;
	if (keyCode !== 13) {
		// event keyup and keycode === 13 means press "enter".
		return;
	}
	if (message.length === 0) {
		return;
	}
	socket.emit('send-messages', { message, uid });
	txtMessage.value = '';
});

const main = async () => {
	await validarJWT();
};

main();
