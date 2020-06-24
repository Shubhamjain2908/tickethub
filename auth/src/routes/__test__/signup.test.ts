import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'ckmbpkmc'
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'abckmb',
            password: 'ckmbpkmc'
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'abckmb',
            password: 'pk'
        })
        .expect(400);
});

it('returns a 400 with an missing email & password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'ckmb@pkmc.com'
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'ckmbpkmc'
        })
        .expect(400);
});