const request = require('supertest');
const bcrypt = require('bcryptjs');

const app = require('../../app');
const User = require('../../models/User');

describe('POST /api/auth/login', () => {

    beforeEach(async () => {
        await User.deleteMany({});

        const hashedPassword = await bcrypt.hash('Test@123', 10);

        await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
            role: 'Receptionist'
        });
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    // TC_AUTH_001
    test('TC_AUTH_001 - should login successfully with valid credentials', async () => {

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'Test@123'
            });

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty('token');

        expect(response.body).toHaveProperty('user');

        expect(response.body.user).toHaveProperty('id');

        expect(response.body.user.name).toBe('Test User');

        expect(response.body.user.email).toBe('test@example.com');

        expect(response.body.user.role).toBe('Receptionist');

        expect(response.body.user).not.toHaveProperty('password');
    });

    // TC_AUTH_002
    test('TC_AUTH_002 - should reject login with incorrect password', async () => {

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'WrongPassword@123'
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.message).toBe('Invalid credentials');

        expect(response.body).not.toHaveProperty('token');

        expect(response.body).not.toHaveProperty('user');
    });

    // TC_AUTH_003
    test('TC_AUTH_003 - should reject login with non-existing email', async () => {

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'notregistered@example.com',
                password: 'Test@123'
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.message).toBe('Invalid credentials');

        expect(response.body).not.toHaveProperty('token');

        expect(response.body).not.toHaveProperty('user');
    });

});
// TC_AUTH_004
test('TC_AUTH_004 - should reject login when email is missing', async () => {

    const response = await request(app)
        .post('/api/auth/login')
        .send({
            password: 'Test@123'
        });

    expect(response.statusCode).toBe(401);

    expect(response.body.message).toBe('Invalid credentials');

    expect(response.body).not.toHaveProperty('token');

    expect(response.body).not.toHaveProperty('user');
});

// TC_AUTH_005
test('TC_AUTH_005 - should reject login when password is missing', async () => {

    const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'test@example.com'
        });

    expect(response.statusCode).toBe(401);

    expect(response.body).toHaveProperty('message');

    expect(response.body).not.toHaveProperty('token');

    expect(response.body).not.toHaveProperty('user');
});

// TC_AUTH_006
test('TC_AUTH_006 - should reject login when email and password are missing', async () => {

    const response = await request(app)
        .post('/api/auth/login')
        .send({});

    expect(response.statusCode).toBe(401);

    expect(response.body.message).toBe('Invalid credentials');

    expect(response.body).not.toHaveProperty('token');

    expect(response.body).not.toHaveProperty('user');
});