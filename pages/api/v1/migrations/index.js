import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(_request, response) {
  const pendingMigrations = await runMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(_request, response) {
  const migratedMigrations = await runMigrations({ dryRun: false });
  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}

async function runMigrations({ dryRun = true } = {}) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = {
      dbClient,
      dryRun,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}
