import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();


export const resolvers = {
    Query: {
        async getUsers() {
            const all = await prisma.user.findMany();
            return all;
        }
    },
    Mutation: {

    }
}