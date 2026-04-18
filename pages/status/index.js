import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function UpdatedAt() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const updatedAtText =
    !isLoading && data
      ? new Date(data.updated_at).toLocaleString("pt-BR")
      : "Carregando...";

  return <div>Última atualização em: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const databaseData = !isLoading && data ? data.dependencies.database : null;

  const version = databaseData ? databaseData.version : "Carregando...";
  const maxConnections = databaseData
    ? databaseData.max_connections
    : "Carregando...";
  const opennedConnections = databaseData
    ? databaseData.opened_connections
    : "Carregando...";

  return (
    <>
      <h2>Banco de Dados</h2>
      <div>Versão: {version}</div>
      <div>Número máximo de conexões: {maxConnections}</div>
      <div>Conexões abertas: {opennedConnections}</div>
    </>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}
