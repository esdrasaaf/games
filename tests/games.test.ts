import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import app from "app";
import supertest from "supertest";
import prisma from "config/database";
import { createGame } from "./factories/games-factory"
import { createConsole } from "./factories/consoles-factory";

beforeEach(async () => {
    await prisma.game.deleteMany({});
    await prisma.console.deleteMany({});
});

const server = supertest(app);

describe("GET /games", () => {
    it("should respond with status 200 and games data", async () => {
        const console = await createConsole();
        const game = await createGame(console.id);

        const response = await server.get("/games");

        expect(response.statusCode).toBe(httpStatus.OK);
        expect(response.body).toEqual([game]);
    });
});

describe("GET /games/:id", () => {
    it("should respond with status 404 for invalid game id", async () => {
        const console = await createConsole();
        const game = await createGame(console.id);

        const response = await server.get(`/games/${game.id + 1}`);

        expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    }) 

    it("should respond with status 200 and game data", async () => {
        const _console = await createConsole();
        const game = await createGame(_console.id);
        delete game.Console;

        const response = await server.get(`/games/${game.id}`);

        expect(response.statusCode).toBe(httpStatus.OK);
        expect(response.body).toEqual(game);
    })
});

describe("POST /games", () => {
    it("Should response with 422 when body is incorrect", async () => {
        const body = {
            name: faker.lorem.word(),
            consoleId: faker.datatype.number()
        };

        const response = await server.post("/games").send(body);

        expect(response.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("Should response with 409 when game already exists", async () => {
        const console = await createConsole();
        await createGame(console.id, "LOL");

        const body = {
            title: "LOL",
            consoleId: console.id
        };
    
        const response = await server.post("/games").send(body);
    
        expect(response.statusCode).toBe(httpStatus.CONFLICT);
    })

    it("Should response with 201", async () => {
        const console = await createConsole();
        const body = {
            title: faker.lorem.word(),
            consoleId: console.id
        };
    
        const response = await server.post("/games").send(body);
    
        expect(response.statusCode).toBe(httpStatus.CREATED);
      })
});
