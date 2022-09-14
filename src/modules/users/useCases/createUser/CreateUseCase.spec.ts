import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"



let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {

    beforeEach(() => {
        inMemoryUsersRepository =  new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })


    it("Should be able to create a new user", async () => {
        const user = await createUserUseCase.execute({
            email: "email@test.com",
            password: "passwordTest",
            name: "nameTest"
        })
        expect(user).toHaveProperty("id");
    })

    it("Should not be able to create a new user with same email", () => {
        expect(async () => {
            await createUserUseCase.execute({
                email: "email@test.com",
                password: "passwordTest",
                name: "nameTest"
            })
            await createUserUseCase.execute({
                email: "email@test.com",
                password: "passwordTest",
                name: "nameTest"
            })
        }).rejects.toBeInstanceOf(CreateUserError);
    })

})