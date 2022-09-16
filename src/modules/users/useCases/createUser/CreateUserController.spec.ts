import request from "supertest";
import { conectionData } from '../../../../database'
import { app } from "../../../../app";
import { Connection } from "typeorm";

let conection : Connection;

describe("Create User Controller", () => {

    beforeAll( async () => {
        conection = await conectionData();
        await conection.runMigrations();
    })

    afterAll(async () => {
        await conection.dropDatabase()
        await conection.close()
    })

    it("Should be able create a user", async () => {
        const response = await request(app)
        .post("/api/v1/users")
        .send({
            name: "nameTest",
            email: "email@test.com.br",
            password: "12345"
        });
        expect(response.status).toBe(201)
    })

    it("Should not be able create a user if user already", async () => {
        await request(app)
        .post("/api/v1/users")
        .send({
            name: "nameTest",
            email: "emailtest@test.com.br",
            password: "12345"
        });

        const response = await request(app)
        .post("/api/v1/users")
        .send({
            name: "nameTest",
            email: "emailtest@test.com.br",
            password: "12345"
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("User already exists")
    })

})