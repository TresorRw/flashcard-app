import { PrismaClient } from "@prisma/client"
import { loggedInUser, loginUserProps, registerUserProps, singleUserProps, userIdProps } from "../interfaces/User.js";
import { hashString } from "../utils/pwdChecker.js";
import bcrypt from "bcrypt";
import { encode } from "../utils/tokenCheck.js";
import { createFlashCartProps, editFlashCartProps } from "../interfaces/Flashcard.js";

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
        },
        async loginUser(parent, args: loginUserProps) {
            const userData = { username: args.username.toLowerCase(), password: args.password };
            const userMatch = await prisma.user.findFirst({ where: { username: userData.username } })
            if (!userMatch) {
                return { message: "These credentials are not familiar to us, try again." }
            } else {
                const savedPwd = userMatch.password;
                const checkMatch = await bcrypt.compare(userData.password, savedPwd);
                if (!checkMatch) {
                    return { message: "Password mismatch, try again." }
                } else {
                    const token = encode({ id: userMatch.id, username: userMatch.username, display_name: userMatch.display_name });
                    return { message: "Login Successfully!", data: userMatch, token }
                }
            }
        },
        async createFlashCard(parent, args: createFlashCartProps, contextValue: loggedInUser) {
            if (!contextValue.user) return { message: "Please Login to continue." }
            const newFC = { question: args.question, answer: args.answer, topic: args.topic, userId: contextValue.user.id };
            const saveFlashCard = await prisma.flashCard.create({ data: newFC })
            if (saveFlashCard) {
                return { message: "Your flash card has been saved", data: saveFlashCard }
            } else {
                return { message: "Your flash card has not been saved" }
            }
        },
        async updateFlashCard(parent, args: editFlashCartProps, contextValue: loggedInUser) {
            if (!contextValue.user) return { message: "Please login to continue." }
            const checkCard = await prisma.flashCard.findFirst({ where: { id: args.fc_id, userId: contextValue.user.id } });
            if (!checkCard) return { message: `We can not find flash card with ${args.fc_id} in your account.` };
            const editedCard = { question: args.question, answer: args.answer, topic: args.topic }
            const updateFlashCard = await prisma.flashCard.update({ where: { id: args.fc_id }, data: editedCard });
            if (updateFlashCard) {
                return { message: "Flash card updated successfully", data: editedCard }
            } else {
                return { message: "Flash card not updated successfully." }
            }
        }
    }
}