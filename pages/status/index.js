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

  return (
    <>
      <h2>Banco de Dados</h2>
      {databaseData ? (
        <>
          <div>Versão: {databaseData.version}</div>
          <div>Máximo de conexões: {databaseData.max_connections}</div>
          <div>Máximo de conexões: {databaseData.opened_connections}</div>
        </>
      ) : (
        <div>Carregando...</div>
      )}
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
