const request = require('supertest');
const bcrypt = require('bcryptjs');

const app = require('../../app');
const User = require('../../models/User');

describe('POST /api/auth/register', () => {

    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    // TC_AUTH_REG_001
    test('TC_AUTH_REG_001 - should register a new user successfully', async () => {

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'New Test User',
                email: 'newuser@example.com',
                password: 'Test@123',
                role: 'Receptionist'
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty('token');

        expect(response.body).toHaveProperty('user');

        expect(response.body.user).toHaveProperty('id');

        expect(response.body.user.name).toBe('New Test User');

        expect(response.body.user.email).toBe('newuser@example.com');

        expect(response.body.user.role).toBe('Receptionist');

        expect(response.body.user).not.toHaveProperty('password');

        const createdUser = await User.findOne({
            email: 'newuser@example.com'
        });

        expect(createdUser).not.toBeNull();

        expect(createdUser.name).toBe('New Test User');

        expect(createdUser.email).toBe('newuser@example.com');

        expect(createdUser.role).toBe('Receptionist');

        expect(createdUser.password).not.toBe('Test@123');

        const passwordMatches = await bcrypt.compare(
            'Test@123',
            createdUser.password
        );

        expect(passwordMatches).toBe(true);
    });

    // TC_AUTH_REG_002
    test('TC_AUTH_REG_002 - should reject registration with duplicate email', async () => {

        // Create the first user
        await User.create({
            name: 'Existing User',
            email: 'existing@example.com',
            password: await bcrypt.hash('Test@123', 10),
            role: 'Receptionist'
        });

        // Try to register another user with the same email
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Another User',
                email: 'existing@example.com',
                password: 'Another@123',
                role: 'Receptionist'
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.message).toBe('User already exists');

        expect(response.body).not.toHaveProperty('token');

        expect(response.body).not.toHaveProperty('user');
    });

    // TC_AUTH_REG_003
    test('TC_AUTH_REG_003 - should reject registration when name is missing', async () => {

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'noname@example.com',
                password: 'Test@123',
                role: 'Receptionist'
            });

        expect(response.statusCode).toBe(500);

        expect(response.body).toHaveProperty('message');

        expect(response.body.message).toMatch(/name.*required/i);

        expect(response.body).not.toHaveProperty('token');

        expect(response.body).not.toHaveProperty('user');

        const createdUser = await User.findOne({
            email: 'noname@example.com'
        });

        expect(createdUser).toBeNull();
    });

    // TC_AUTH_REG_004
    test('TC_AUTH_REG_004 - should reject registration when email is missing', async () => {

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'No Email User',
                password: 'Test@123',
                role: 'Receptionist'
            });

        expect(response.statusCode).toBe(500);

        expect(response.body).toHaveProperty('message');

        expect(response.body.message).toMatch(/email.*required/i);

        expect(response.body).not.toHaveProperty('token');

        expect(response.body).not.toHaveProperty('user');

        const users = await User.find({
            name: 'No Email User'
        });

        expect(users).toHaveLength(0);
    });

    // TC_AUTH_REG_005
    test('TC_AUTH_REG_005 - should reject registration when password is missing', async () => {

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'No Password User',
                email: 'nopassword@example.com',
                role: 'Receptionist'
            });

        expect(response.statusCode).toBe(500);

        expect(response.body).toHaveProperty('message');

        expect(response.body.message).toBe('Illegal arguments: undefined, string');

        expect(response.body).not.toHaveProperty('token');

        expect(response.body).not.toHaveProperty('user');

        const createdUser = await User.findOne({
            email: 'nopassword@example.com'
        });

        expect(createdUser).toBeNull();
    });

    // TC_AUTH_REG_006
    test('TC_AUTH_REG_006 - should register user with default role when role is missing', async () => {

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Default Role User',
                email: 'defaultrole@example.com',
                password: 'Test@123'
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty('token');

        expect(response.body).toHaveProperty('user');

        expect(response.body.user).toHaveProperty('id');

        expect(response.body.user.name).toBe('Default Role User');

        expect(response.body.user.email).toBe('defaultrole@example.com');

        expect(response.body.user.role).toBe('Receptionist');

        expect(response.body.user).not.toHaveProperty('password');

        const createdUser = await User.findOne({
            email: 'defaultrole@example.com'
        });

        expect(createdUser).not.toBeNull();

        expect(createdUser.role).toBe('Receptionist');

        expect(createdUser.name).toBe('Default Role User');

        expect(createdUser.email).toBe('defaultrole@example.com');
    });

    // TC_AUTH_REG_007
    test('TC_AUTH_REG_007 - should reject registration with invalid role', async () => {

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Invalid Role User',
                email: 'invalidrole@example.com',
                password: 'Test@123',
                role: 'Doctor'
            });

        expect(response.statusCode).toBe(500);

        expect(response.body).toHaveProperty('message');

        expect(response.body.message).toMatch(/role.*(?:enum|`Admin`|`Receptionist`)/i);

        expect(response.body).not.toHaveProperty('token');

        expect(response.body).not.toHaveProperty('user');

        const createdUser = await User.findOne({
            email: 'invalidrole@example.com'
        });

        expect(createdUser).toBeNull();
    });

    // TC_AUTH_REG_008
    test('TC_AUTH_REG_008 - should reject registration with empty request body', async () => {

        const response = await request(app)
            .post('/api/auth/register')
            .send({});

        expect(response.statusCode).toBe(500);

        expect(response.body).toHaveProperty('message');

        expect(response.body.message).toBe(
            'Illegal arguments: undefined, string'
        );

        expect(response.body).not.toHaveProperty('token');

        expect(response.body).not.toHaveProperty('user');

        const users = await User.find({});

        expect(users).toHaveLength(0);
    });

    // TC_AUTH_REG_009
    test('TC_AUTH_REG_009 - should reject registration when name is empty', async () => {

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: '',
                email: 'emptyname@example.com',
                password: 'Test@123',
                role: 'Receptionist'
            });

        expect(response.statusCode).toBe(500);

        expect(response.body).toHaveProperty('message');

        expect(response.body.message).toMatch(/name.*required/i);

        expect(response.body).not.toHaveProperty('token');

        expect(response.body).not.toHaveProperty('user');

        const createdUser = await User.findOne({
            email: 'emptyname@example.com'
        });

        expect(createdUser).toBeNull();
    });

});

