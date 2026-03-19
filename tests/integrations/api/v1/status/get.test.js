test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.updated_at).toBeDefined();
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(parsedUpdatedAt).toEqual(responseBody.updated_at);

  const databaseResponseData = responseBody.dependencies.database;
  expect(databaseResponseData).toBeDefined();
  expect(databaseResponseData.version).toBeDefined();
  expect(databaseResponseData.max_connections).toBeDefined();
  expect(databaseResponseData.opened_connections).toBeDefined();

  expect(databaseResponseData.version).toEqual("16.0");
  expect(databaseResponseData.max_connections).toEqual(100);
  expect(databaseResponseData.opened_connections).toEqual(1);
});
