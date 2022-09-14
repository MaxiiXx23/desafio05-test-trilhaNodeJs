import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceError } from "./GetBalanceError";


let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();

        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );

        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            inMemoryUsersRepository
        );

    })

    it("Should be able get balance of the user.", async () => {

        const user = await createUserUseCase.execute({
            email: "usertest@test.com",
            password: "12345",
            name: "userTest"
        })

        await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 10.50,
            description: "First Deposit"
        })


        const balance = await getBalanceUseCase.execute({
            user_id: user.id as string,
        })

        expect(balance.statement.length).toBe(1);
        expect(balance).toHaveProperty("balance");
    })

    it("Should not be able get balance if user not found.", () => {

        expect(async () => {
            const user = await createUserUseCase.execute({
                email: "usertest@test.com",
                password: "12345",
                name: "userTest"
            })
    
            await createStatementUseCase.execute({
                user_id: user.id as string,
                type: OperationType.DEPOSIT,
                amount: 10.50,
                description: "First Deposit"
            })
            
            await getBalanceUseCase.execute({
                user_id : "uuidFake",
            })
            
        }).rejects.toBeInstanceOf(GetBalanceError)

    })

})