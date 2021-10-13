const express = require('express')
const app = express();

const path = require('path');

app.use(express.json());

// connect mongodb database
require('./server/database/database');

app.use('/uploads', express.static('./uploads'));

// calling routes
app.use('/', require('./server/router/router'));

app.listen(3000, () => console.log(`Server is stated on http://localhost:3000`));