import { PrismaClient } from "@prisma/client"
import { registerUserProps, singleUserProps, userIdProps } from "../interfaces/User.js";
import { hashString } from "../utils/pwdChecker.js";
const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        async getUsers() {
            const all = await prisma.user.findMany();
            return all;
        },
        async getFlashCards() {
            const flashcards = await prisma.flashCard.findMany()
            return flashcards
        },
        async getSingleUser(parent, args: singleUserProps) {
            const matches = await prisma.user.findFirstOrThrow({ where: { username: args.username } })
            return matches;
        },
        async getUserFlashCards(parent, args: userIdProps) {
            const matches = await prisma.user.findFirstOrThrow({ where: { id: args.userId } });
            return matches;
        }
    },
    Mutation: {
        async registerUser(parent, args: registerUserProps) {
            const hashedPassword = await hashString(args.password);
            const newUser = { username: args.username.toLowerCase(), password: hashedPassword, display_name: args.display_name }
            const checkUnique = await prisma.user.findFirst({ where: { username: args.username.toLowerCase() } })
            if (!checkUnique) {
                const register = await prisma.user.create({ data: newUser });
                if (register) {
                    return { message: "Your account has been created.", data: register }
                } else {
                    return { message: "Sorry for inconvenience, try again" }
                }
            } else {
                return { message: "Username is already in use." }
            }
        }
    }
}