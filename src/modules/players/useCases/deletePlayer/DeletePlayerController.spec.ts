import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("Delete Player Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to delete a player", async () => {
    const player = await request(app).post("/player").send({
      summonerName: "OldWolfKing",
    });

    const { id } = player.body;

    const response = await request(app).delete(`/player/${id}`);

    const { message } = response.body;

    expect(response.status).toBe(200);
    expect(message).toBe("successfully deleted");
  }, 10000);

  it("should not be able to delete a player that does not exist", async () => {
    const id = "1e11111c-1c1b-1e11-1121-11111111ad11";

    const response = await request(app).delete(`/player/${id}`);

    const { message } = response.body;

    expect(response.status).toBe(400);
    expect(message).toBe("Player does not exists!");
  });
});
