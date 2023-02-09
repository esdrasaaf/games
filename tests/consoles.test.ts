import httpStatus from "http-status";
import app from "app";
import supertest from "supertest";
import { createConsole } from "./factories/consoles-factory";
import prisma from "config/database";
import { faker } from "@faker-js/faker";

beforeEach(async () => {
    await prisma.game.deleteMany({});
    await prisma.console.deleteMany({});
});

const server = supertest(app);

describe("GET /consoles", () => {
    it("Should response with 200 and console data", async () => {
      const console = await createConsole();

      const response = await server.get("/consoles");

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body).toEqual([console]);
    })
});

describe("GET /consoles/:id", () => {
  it("Should response with 404 if console no exist", async () => {
    const console = await createConsole();

    const response = await server.get(`/consoles/${console.id + 1}`);

    expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
  })

  it("Should response with 200 and console data", async () => {
    const console = await createConsole();

    const response = await server.get(`/consoles/${console.id}`);

    expect(response.statusCode).toBe(httpStatus.OK);
    expect(response.body).toEqual(console);
  })
});

describe("POST /consoles", () => {
  it("Should response with 422 when body is incorrect", async () => {
    const body = {
      title: faker.lorem.word()
    };

    const response = await server.post("/consoles").send(body);

    expect(response.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("Should response with 409 when console already exists", async () => {
    await createConsole("PS1");
    const body = {
      name: "PS1"
    };

    const response = await server.post("/consoles").send(body);

    expect(response.statusCode).toBe(httpStatus.CONFLICT);
  });

  it("Should response with 201", async () => {
    const body = {
      name: faker.lorem.word()
    };

    const response = await server.post("/consoles").send(body);

    expect(response.statusCode).toBe(httpStatus.CREATED);
  })

});
