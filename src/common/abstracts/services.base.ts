import { DataSource, EntityManager, QueryRunner } from 'typeorm'

export class ServicesBase {
  constructor(private dataSource: DataSource) {}

  /**
   * Gets a query runner for the data source.
   * The query runner is not connected and no transaction is started.
   * @returns a query runner
   */
  getQueryRunner(): QueryRunner {
    return this.dataSource.createQueryRunner()
  }

  /**
   * Gets a manager that can be used to interact with the database.
   * The manager is not connected and no transaction is started.
   * @returns a manager
   */
  getQueryManager(): EntityManager {
    return this.dataSource.manager
  }

  /**
   * Creates a query runner and a manager that can be used within a transaction.
   * The query runner is connected and a transaction is started.
   * @returns an object with a query runner and a manager
   */
  getQueryManagerWithTransaction(): {
    queryRunner: QueryRunner
    manager: EntityManager
  } {
    const queryRunner = this.getQueryRunner()
    queryRunner.connect()
    queryRunner.startTransaction()
    const manager = queryRunner.manager

    return { queryRunner, manager }
  }
}
