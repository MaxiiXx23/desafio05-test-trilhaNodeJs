import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {

    beforeEach(async () => {

        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

        inMemoryStatementsRepository = new InMemoryStatementsRepository();

        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );

        getStatementOperationUseCase = new GetStatementOperationUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        )


    })

    it("Should be able to get statement", async () => {

        const user = await createUserUseCase.execute({
            name: "nameTest",
            email: "test@test.com.br",
            password: "12345"
        })

        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 50.40,
            description: "First Deposit"
        })

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string,
        })

        expect(statementOperation).toHaveProperty("id")

    })

    it("Should not be able to get statement if user not found.", async () => {

        const user = await createUserUseCase.execute({
            name: "nameTest",
            email: "test@test.com.br",
            password: "12345"
        })

        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 45.75,
            description: "Third Deposit"
        })

        await expect(getStatementOperationUseCase.execute({
            user_id: "idUserFake",
            statement_id: statement.id as string,
        })).rejects.toEqual(new GetStatementOperationError.UserNotFound())


    })

    it("Should not be able to get statement if statement not found.", async () => {

        const user = await createUserUseCase.execute({
            name: "nameTest",
            email: "test@test.com.br",
            password: "12345"
        })

        await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 270.50,
            description: "Third Deposit"
        })

        await expect(getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: "idStatementFake",
        })).rejects.toEqual(new GetStatementOperationError.StatementNotFound())
    })


})