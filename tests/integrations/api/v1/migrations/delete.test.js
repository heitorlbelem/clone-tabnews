import database from "infra/database";

const cleanDatabase = async () => {
  await database.query("drop schema public cascade; create schema public;");
};

beforeAll(cleanDatabase);

test("DELETE to /api/v1/migrations should return 405", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE",
  });
  expect(response.status).toBe(405);
  const responseBody = await response.json();
  expect(responseBody.error).toEqual('Method "DELETE" not allowed');
});
