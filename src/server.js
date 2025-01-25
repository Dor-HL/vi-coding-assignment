const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '../.env')});
const express = require('express');
const app = express();
const port = 3000;

const Routes = require('./routes');


app.use('/api/v1/marvel', Routes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});