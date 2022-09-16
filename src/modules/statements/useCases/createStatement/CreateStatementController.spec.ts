import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";

import { conectionData } from "../../../../database";
import { app } from "../../../../app";


let connection: Connection;

describe("Create Statement Controller", () => {


    beforeAll(async () => {
        connection = await conectionData();
        await connection.runMigrations();

        const passwordHash = await hash('12345', 8)
        const id = uuidV4();


        await connection.query(`INSERT INTO users(id, name, email, password, created_at, updated_at)
            VALUES('${id}', 'nametest', 'test4@test.com', '${passwordHash}', 'now()', 'now()')
        `)

    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })

    it("Should be able to create a Statement", async () => {

        const responseToken = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test4@test.com',
            password: '12345'
        });

        const { token } = responseToken.body;

        const response = await request(app)
        .post('/api/v1/statements/deposit')
        .send({
            amount: 80.75,
            description: 'January Deposit'
        })
        .set({
            Authorization: `Bearer ${token}`
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
    })

    it("Should not be able to create a Statement if withdraw is greater than the balance", async () => {

        const responseToken = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test4@test.com',
            password: '12345'
        });

        const { token } = responseToken.body;

        const response = await request(app)
        .post('/api/v1/statements/withdraw')
        .send({
            amount: 90.75,
            description: 'January Deposit'
        })
        .set({
            Authorization: `Bearer ${token}`
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toEqual("Insufficient funds")
    })

})