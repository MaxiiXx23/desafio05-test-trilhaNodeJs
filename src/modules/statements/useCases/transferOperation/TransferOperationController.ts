import { Request, Response } from "express";
import { container } from "tsyringe";

import { TransferOperationUseCase } from "./TransferOperationUseCase";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
}

class TransferOperationController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;
        const { id: user_id } = request.params;

        const { amount, description } = request.body;

        const type = 'transfer' as OperationType;

        const transferOperationUseCase = container.resolve(TransferOperationUseCase);

        try {
            const statement = await transferOperationUseCase.execute({
                user_id,
                sender_id: id,
                type,
                amount,
                description
            });
            return response.json({ msg: "Transfer successful", statement })
        }   
        catch (e) {
            const { message } = e as Error;
            return response.status(400).json({msg: message})
        }


    }

}

export { TransferOperationController };