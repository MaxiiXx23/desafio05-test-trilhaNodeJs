import request from "supertest";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

import { conectionData } from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;
describe("Show User Profile Controller", () => {

    beforeAll(async () => {
        connection = await conectionData();
        await connection.runMigrations();

        const passwordHash = await hash('12345', 8)
        const id = uuidV4();


        await connection.query(`INSERT INTO users(id, name, email, password, created_at, updated_at)
            VALUES('${id}', 'nametest', 'test3@test.com', '${passwordHash}', 'now()', 'now()')
        `)

    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })

    it("Should be able to show profile user", async () => {

        const responseToken = await request(app)
            .post('/api/v1/sessions')
            .send({
                email: 'test3@test.com',
                password: '12345'
            });

        const { token } = responseToken.body;

        const response = await request(app)
            .get('/api/v1/profile')
            .set({
                Authorization: `Bearer ${token}`
            })

        expect(response.body).toHaveProperty("id");
    })

    it("Should not be able to show profile user if email is incorrect", async () => {
        // token with fake email
        const randomToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1IiwiaWF0IjoxNTE2MjM5MDIyfQ.OyyYfFDwHasRqGYnVgVgr-nIkxKV-mUKJgGVqQ0-h5k";

        const response = await request(app)
            .get('/api/v1/profile')
            .set({
                Authorization: `Bearer ${randomToken}`
            })
        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("JWT invalid token!");
    })

    it("Should not be able to show profile user if password is incorrect", async () => {
        // token with fake password
        const randomToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6InRlc3QzQHRlc3QuY29tIiwicGFzc3dvcmQiOiJ0ZXN0IiwiaWF0IjoxNTE2MjM5MDIyfQ.iAtsHbjxVymYm1XV6ka1CDsPCq6iHeivf6-eSLGmuBE";

        const response = await request(app)
            .get('/api/v1/profile')
            .set({
                Authorization: `Bearer ${randomToken}`
            })
        expect(response.status).toBe(401);
        expect(response.body.message).toEqual("JWT invalid token!");
    })


})