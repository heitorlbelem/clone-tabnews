import database from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();
router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(_request, response) {
  const databaseVersion = await database.query("SHOW SERVER_VERSION;");
  const databaseMaxConnections = await database.query("SHOW max_connections");
  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenConnections = await database.query({
    text: "SELECT count(*)::int as opened_connections from pg_stat_activity WHERE datname=$1;",
    values: [databaseName],
  });

  return response.status(200).json({
    updated_at: new Date().toISOString(),
    dependencies: {
      database: {
        version: databaseVersion.rows[0].server_version,
        max_connections: new Number(
          databaseMaxConnections.rows[0].max_connections,
        ),
        opened_connections: databaseOpenConnections.rows[0].opened_connections,
      },
    },
  });
}
