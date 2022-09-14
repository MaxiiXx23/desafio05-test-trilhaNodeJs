import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";



let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate user", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository); 
    })

    it("Should be able to authenticate the user", async () => {

        await createUserUseCase.execute({
            email: "email@test.com",
            password: "12345test",
            name: "nameTest"
        })

        const {user, token } = await authenticateUserUseCase.execute({
            email: "email@test.com",
            password: "12345test"
        })
        expect(user).toHaveProperty("id");
        expect(token).not.toBe("");

    })

    it("Should not be able to authenticate if email is incorrect.", () => {
        expect( async () => {
            await createUserUseCase.execute({
                email: "emailtest@test.com",
                password: "passwordTest",
                name: "TestUser"
            })
    
            await authenticateUserUseCase.execute({
                email: "email@test.com",
                password: "12345test"
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

    })

    it("Should not be able to authenticate if password is incorrect.", () => {
        expect( async () => {
            await createUserUseCase.execute({
                email: "usertest@test.com",
                password: "passwordTest",
                name: "TestUser"
            })
    
            await authenticateUserUseCase.execute({
                email: "usertest@test.com",
                password: "12345test"
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

    })


})