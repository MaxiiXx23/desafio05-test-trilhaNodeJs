import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";

import { conectionData } from "../../../../database";
import { app } from "../../../../app";


let connection: Connection;

describe("Get Balance Controller", () => {

    beforeAll(async () => {
        connection = await conectionData();
        await connection.runMigrations();

        const passwordHash = await hash('12345', 8)
        const id = uuidV4();


        await connection.query(`INSERT INTO users(id, name, email, password, created_at, updated_at)
            VALUES('${id}', 'nametest', 'test5@test.com', '${passwordHash}', 'now()', 'now()')
        `)

    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })

    it("Should be able to get balance of user", async () => {

        const responseToken = await request(app)
            .post('/api/v1/sessions')
            .send({
                email: 'test5@test.com',
                password: '12345'
            });

        const { token } = responseToken.body;

        await request(app)
            .post('/api/v1/statements/deposit')
            .send({
                amount: 80.75,
                description: 'January Deposit'
            })
            .set({
                Authorization: `Bearer ${token}`
            })

        const response = await request(app)
            .get("/api/v1/statements/balance")
            .set({
                Authorization: `Bearer ${token}`
            })

        expect(response.body).toHaveProperty("balance")
        expect(response.body.statement.length).toBe(1)

    })
})