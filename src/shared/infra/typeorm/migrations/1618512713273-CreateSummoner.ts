import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSummoner1618512713273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "summoners",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
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
            type: "numeric",
          },
          {
            name: "profileIconId",
            type: "numeric",
          },
          {
            name: "summonerId",
            type: "varchar",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("summoners");
  }
}
