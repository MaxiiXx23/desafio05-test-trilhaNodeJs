import request from "supertest";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import { conectionData } from "../../../../database";


let conection : Connection;

describe("Authenticate Controller", () => {

    beforeAll(async () => {

        conection = await conectionData();
        await conection.runMigrations();
        
        const passwordHash = await hash('12345', 8)
        const id = uuidV4();
        

        await conection.query(`INSERT INTO users(id, name, email, password, created_at, updated_at)
            VALUES('${id}', 'nametest', 'test2@test.com', '${passwordHash}', 'now()', 'now()')
        `)

    })

    afterAll(async () => {
        await conection.dropDatabase();
        await conection.close();
    })

    it("Should be able authenticate user", async () => {

        const response = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test2@test.com',
            password: '12345'
        });


        expect(response.body).toHaveProperty("user")
        expect(response.body).toHaveProperty("token")
    })

    it("Should not be able authenticate user if email is incorrect", async () => {

        const response = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test@test.com',
            password: '12345'
        });
        expect(response.status).toEqual(401)
        expect(response.body.message).toEqual("Incorrect email or password")
    })

    it("Should not be able authenticate user if password is incorrect", async () => {

        const response = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test2@test.com',
            password: '12346'
        });
        expect(response.status).toEqual(401)
        expect(response.body.message).toEqual("Incorrect email or password")
    })

})