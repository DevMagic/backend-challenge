import { MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSummonerTable1620251060903 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "summoner",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "nickname",
                        type: "varchar",
                    },
                    {
                        name: "accountId",
                        type: "varchar",
                    },
                    {
                        name: "summonerLevel",
                        type: "int",
                    },
                    {
                        name: "profileIconId",
                        type: "int",
                    },
                    {
                        name: "summonerId",
                        type: "varchar",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("summoner");
    }

}
