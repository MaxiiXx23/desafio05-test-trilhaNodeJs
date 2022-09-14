import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"


let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatamentsRespository: InMemoryStatementsRepository;

let createUserCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserCase = new CreateUserUseCase(inMemoryUsersRepository);

        inMemoryStatamentsRespository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatamentsRespository
        )


    })

    it("Should be able to create a new statement", async () => {

        const user = await createUserCase.execute({
            name: "userTest",
            email: "emailtest@ignite.com.br",
            password: "12345"
        })

        const statementOperation = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 90,
            description: "First Deposit"
        })

        expect(statementOperation).toHaveProperty("id");
    })

    it("Should not be able to create a new statement if user not found", async () => {

        await createUserCase.execute({
            name: "userTest",
            email: "emailtest@ignite.com.br",
            password: "12345"
        })


        await expect(createStatementUseCase.execute({
            user_id: "123456",
            type: OperationType.DEPOSIT,
            amount: 90,
            description: "First Deposit"
        })).rejects.toEqual(new CreateStatementError.UserNotFound())

    })

    it("Should not be able to create a new statement if insufficient funds", async () => {

        const user = await createUserCase.execute({
            name: "userTest",
            email: "emailtest@ignite.com.br",
            password: "12345"
        })

        await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 90,
            description: "First Deposit"
        })

        await expect(createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.WITHDRAW,
            amount: 91,
            description: "First Deposit"
        })).rejects.toEqual( new CreateStatementError.InsufficientFunds())
        
    })

})