import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { ServiceError } from "infra/errors";

const defaultMigrationOptions = {
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  const pendingMigrations = await executeMigrationsCommand({ dryRun: true });
  return pendingMigrations;
}

async function runPendingMigrations() {
  const migratedMigrations = await executeMigrationsCommand({ dryRun: false });
  return migratedMigrations;
}

async function executeMigrationsCommand({ dryRun }) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun,
    });
    return migrations;
  } catch (error) {
    const databaseServiceError = new ServiceError({
      message: "Erro de conexão com o Banco de Dados",
      cause: error,
    });
    throw databaseServiceError;
  } finally {
    await dbClient?.end();
  }
}

const migrator = { listPendingMigrations, runPendingMigrations };

export default migrator;
