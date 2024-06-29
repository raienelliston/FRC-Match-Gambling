const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes/routes');
require('dotenv').config();

const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:3080',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions), express.json());
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});