import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("List All Detailed Player Information Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to list all detailed player information", async () => {
    await request(app).post("/player").send({
      summonerName: "OldWolfKing",
    });

    const response = await request(app).get(`/player/all/detailed`);

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("wins");
    expect(response.body[0]).toHaveProperty("losses");
  }, 10000);
});
