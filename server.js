const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
