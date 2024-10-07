const express = require('express');
const app = express();
const Route = require('./Route')
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors())
const dotenv = require('dotenv').config()

const PORT = process.env.PORT || 3020; // Example port, change as needed

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/api", Route)

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});