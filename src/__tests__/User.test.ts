import request from 'supertest';
import { app } from "../app";
import createConnection from '../database';
import { getConnection } from 'typeorm'

describe("User", () => {
  beforeAll(async() => {
    const connection = await createConnection()
    await connection.runMigrations();
  })

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close()
  })

  it("Should be able to create a new User", async () => {
  const response = await request(app).post("/users")
    .send({
      email: "user@exemplo.com",
      name: "User exemple"
  });
  expect(response.status).toBe(201);
  })
});
