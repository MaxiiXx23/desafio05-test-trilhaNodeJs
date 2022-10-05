import { injectable, inject } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
}

@injectable()
class TransferOperationUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("StatementsRepository")
        private statementsRepository: IStatementsRepository,

    ) { }

    async execute({ user_id, sender_id, amount, type, description }: ICreateStatementDTO): Promise<Statement> {
        
        const withdraw = 'withdraw' as OperationType;

        const user = await this.usersRepository.findBySenderId(sender_id as string);

        if (!user) {
            throw new Error("User does not exists!");
        }

        const { balance } = await this.statementsRepository.getSenderBalance({ sender_id });
        
        if (balance < amount) {
            throw new Error("Insufficient funds")
        }

        await this.statementsRepository.create({
            user_id: sender_id as string,
            type: withdraw,
            amount,
            description
        })

         const statementOperation = await this.statementsRepository.create({
             user_id,
             sender_id,
             type,
             amount,
             description
         });

        return statementOperation;
    }

}

export { TransferOperationUseCase };