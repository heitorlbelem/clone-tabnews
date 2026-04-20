import database from "infra/database";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
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
          opened_connections:
            databaseOpenConnections.rows[0].opened_connections,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({ cause: error });
    console.error(publicErrorObject);
    return response
      .status(publicErrorObject.statusCode)
      .json(publicErrorObject);
  }
}

export default status;
