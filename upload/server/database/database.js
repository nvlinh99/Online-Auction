const mongoose = require('mongoose');
const path = require('path');

const envPath = path.join(__dirname, '../../.env')
require('dotenv').config({ path: envPath, })


mongoose
.connect(process.env.MONGO_URL, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
});