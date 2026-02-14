import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVoucherTable1771033062196 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. create voucher table
    await queryRunner.query(`
    CREATE TABLE "voucher" (
      "id" SERIAL PRIMARY KEY,
      "code" varchar NOT NULL,
      "type" varchar NOT NULL,
      "value" integer NOT NULL
    )
  `);

    // 2. add voucher_id column to transaction
    await queryRunner.query(`
    ALTER TABLE "transaction"
    ADD COLUMN "voucher_id" integer
  `);

    // 3. add foreign key
    await queryRunner.query(`
    ALTER TABLE "transaction"
    ADD CONSTRAINT "fk_transaction_voucher"
    FOREIGN KEY ("voucher_id")
    REFERENCES "voucher"("id")
    ON DELETE SET NULL
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "transaction"
        DROP CONSTRAINT "fk_transaction_voucher"
      `);

    await queryRunner.query(`
        ALTER TABLE "transaction"
        DROP COLUMN "voucher_id"
      `);

    await queryRunner.query(`
        DROP TABLE "voucher"
      `);
  }
}
