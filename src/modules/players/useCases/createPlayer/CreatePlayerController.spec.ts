import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("Create Player Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new player", async () => {
    const response = await request(app).post("/player").send({
      summonerName: "OldWolfKing",
    });

    expect(response.status).toBe(201);
  }, 10000);

  it("Should not be able to create a new player with name exists", async () => {
    const response = await request(app).post("/player").send({
      summonerName: "OldWolfKing",
    });

    expect(response.status).toBe(400);
  }, 10000);
});
