import { faker } from "@faker-js/faker";
import prisma from "config/database";

export async function createGame(consoleId: number, title?: string) {
    return await prisma.game.create({
        data: {
            title: (title !== undefined) ? title : faker.lorem.word(),
            consoleId
        },
        include: {
            Console: true
        }
    });
}
