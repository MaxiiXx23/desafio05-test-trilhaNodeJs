import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    })

    it("Should be able to show the profile user.", async () => {

        const user = await createUserUseCase.execute({
            name: "nameTest",
            email: "emailtest@jest.com",
            password: "test",
        })

        const userProfile = await showUserProfileUseCase.execute(user.id as string);
        
        expect(userProfile).toHaveProperty("id");
    })

    it("Should not be able to show the profile user if user not exists", () => {

        expect(async () => {
            await createUserUseCase.execute({
                name: "nameTest",
                email: "emailtest@jest.com",
                password: "test",
            })
            const passwordFake = "123456";
            await showUserProfileUseCase.execute(passwordFake);
        }).rejects.toBeInstanceOf(ShowUserProfileError)
        
    })

})