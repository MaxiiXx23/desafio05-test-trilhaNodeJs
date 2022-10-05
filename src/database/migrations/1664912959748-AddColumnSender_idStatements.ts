import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AddColumnSenderIdStatements1664912959748 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "statements",
            new TableColumn({
                name: "sender_id",
                type: "uuid",
                isNullable: true
            })
        )
        
        await queryRunner.createForeignKey(
            "statements",
            new TableForeignKey({
                columnNames: ["sender_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
                onUpdate: 'CASCADE',
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropForeignKey("statements", "sender_id")
        await queryRunner.dropColumn("statements", "sender_id")
    }

}
