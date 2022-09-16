import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { hash } from "bcryptjs";

import { conectionData } from "../../../../database";
import { app } from "../../../../app";


let connection: Connection;


describe("Get Statement Operation Controller", () => {

    beforeAll(async () => {
        connection = await conectionData();
        await connection.runMigrations();

        const passwordHash = await hash('12345', 8)
        const id = uuidV4();


        await connection.query(`INSERT INTO users(id, name, email, password, created_at, updated_at)
            VALUES('${id}', 'nametest', 'test6@test.com', '${passwordHash}', 'now()', 'now()')
        `)

    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })


    it("Should be able to get statement operation of user", async () => {

        const responseToken = await request(app)
            .post('/api/v1/sessions')
            .send({
                email: 'test6@test.com',
                password: '12345'
            });

        const { token } = responseToken.body;

        const responseStatement = await request(app)
            .post('/api/v1/statements/deposit')
            .send({
                amount: 77.75,
                description: 'Second Deposit'
            })
            .set({
                Authorization: `Bearer ${token}`
            })

        const { id } = responseStatement.body;

        const response = await request(app)
        .get(`/api/v1/statements/${id}`)
        .set({
            Authorization: `Bearer ${token}`
        })

        expect(response.body).toHaveProperty("id")
    
    })

    it("Should not be able to get statement operation of user if statement_id not found", async () => {

        const responseToken = await request(app)
            .post('/api/v1/sessions')
            .send({
                email: 'test6@test.com',
                password: '12345'
            });

        const { token } = responseToken.body;

        await request(app)
            .post('/api/v1/statements/deposit')
            .send({
                amount: 77.75,
                description: 'Second Deposit'
            })
            .set({
                Authorization: `Bearer ${token}`
            })
        const idStatementFake = "76ad290f-78f7-4df6-a6de-30255c602e32";

        const response = await request(app)
        .get(`/api/v1/statements/${idStatementFake}`)
        .set({
            Authorization: `Bearer ${token}`
        })

        expect(response.status).toBe(404);
        expect(response.body.message).toEqual("Statement not found");
        
    
    })

})