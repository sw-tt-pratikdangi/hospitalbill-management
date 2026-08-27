const mongoose = require('mongoose');

require('dotenv').config({
    path: '.env.test'
});

beforeAll(async () => {

    await mongoose.connect(process.env.MONGO_URI);

    // console.log(
    //     `Connected to test database: ${mongoose.connection.name}`
    // );
});

afterAll(async () => {
    await mongoose.connection.close();
});