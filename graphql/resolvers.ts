import { PrismaClient } from "@prisma/client";
import type { UserProps, loggedInUser, loginUserProps, registerUserProps, singleUserProps, userIdProps } from "../interfaces/User";
import { hashString } from "../utils/pwdChecker";
import bcrypt from "bcrypt";
import { encode } from "../utils/tokenCheck";
import type { FlashCardProps, createFlashCardProps, editFlashCardProps, singleFlashCardProp, statusFlashCardProps } from "../interfaces/Flashcard";
import { CreateTopicProps, DeleteTopicProps, EditTopicProps, TopicProps } from "../interfaces/Topic";
import { convertTimestamp } from "../utils/DateConverter";

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        async getUsers() {
            const all = await prisma.user.findMany();
            return all;
        },
        async getFlashCards() {
            const flashcards = await prisma.flashCard.findMany();
            return flashcards;
        },
        async getSingleUser(_: any, args: singleUserProps) {
            const matches = await prisma.user.findFirst({
                where: { username: args.username.toLowerCase() },
            });
            return matches;
        },
        async getUserFlashCards(_: any, args: userIdProps) {
            const matches = await prisma.flashCard.findMany({
                where: { userId: args.userId },
            });
            return matches;
        },
        async getSingleFlashCard(_: any, args: singleFlashCardProp) {
            const matches = await prisma.flashCard.findFirst({
                where: { id: args.flashcard },
            });
            if (matches) {
                return {
                    message: `Flashcard related with ${args.flashcard}`,
                    data: { ...matches, createdAt: convertTimestamp(matches?.createdAt) },
                };
            } else {
                return { message: "Flashcard not found.", data: null };
            }
        },
        async getTopics(_: any, args, contextValue: loggedInUser) {
            if (contextValue.user) {
                const userTopic = await prisma.topic.findMany({
                    where: { userId: contextValue.user.id },
                });
                return userTopic;
            } else {
                const allTopics = await prisma.topic.findMany();
                return allTopics;
            }
        },
    },

    User: {
        FlashCards: async (_: UserProps) => {
            const related = await prisma.flashCard.findMany({
                where: { userId: _.id },
            });
            return related;
        },
        Topics: async (_: UserProps) => {
            const related = await prisma.topic.findMany({ where: { userId: _.id } });
            return related;
        },
    },
    FlashCard: {
        User: async (_: FlashCardProps) => {
            const related = await prisma.user.findFirst({ where: { id: _.userId } });
            return related;
        },
        Topic: async (_: FlashCardProps) => {
            const related = await prisma.topic.findFirst({
                where: { id: _.topicId },
            });
            return related;
        },
    },
    Topic: {
        User: async (_: TopicProps) => {
            const userTopics = await prisma.topic.findFirst({
                where: { id: _.userId },
            });
            return userTopics;
        },
        FlashCards: async (_: TopicProps) => {
            const related = await prisma.flashCard.findMany({
                where: { topicId: _.id },
            });
            return related;
        },
    },
    Mutation: {
        // USER Mutations
        async registerUser(_: any, args: registerUserProps) {
            const hashedPassword = await hashString(args.password);
            const newUser = {
                username: args.username.toLowerCase(),
                password: hashedPassword,
                display_name: args.display_name,
            };
            const checkUnique = await prisma.user.findFirst({
                where: { username: args.username.toLowerCase() },
            });
            if (!checkUnique) {
                const register = await prisma.user.create({ data: newUser });
                if (register) {
                    return { message: "Your account has been created.", data: register };
                } else {
                    return { message: "Sorry for inconvenience, try again" };
                }
            } else {
                return { message: "Username is already in use." };
            }
        },
        async loginUser(_: any, args: loginUserProps) {
            const userData = {
                username: args.username.toLowerCase(),
                password: args.password,
            };
            const userMatch = await prisma.user.findFirst({
                where: { username: userData.username },
            });
            if (!userMatch) {
                return {
                    message: "These credentials are not familiar to us, try again.",
                };
            } else {
                const savedPwd = userMatch.password;
                const checkMatch = await bcrypt.compare(userData.password, savedPwd);
                if (!checkMatch) {
                    return { message: "Password mismatch, try again." };
                } else {
                    const token = encode({
                        id: userMatch.id,
                        username: userMatch.username,
                        display_name: userMatch.display_name,
                    });
                    return { message: "Login Successfully!", data: userMatch, token };
                }
            }
        },

        // Flashcard actions
        async createFlashCard(_: any, args: createFlashCardProps, contextValue: loggedInUser) {
            if (!contextValue.user)
                return { message: "Please login to create a new topic" };
            const newFC = {
                reference: args.reference,
                question: args.question,
                answer: args.answer,
                topicId: args.topicId,
                userId: contextValue.user.id,
            };
            const saveFlashCard = await prisma.flashCard.create({ data: newFC });
            if (saveFlashCard) {
                return {
                    message: "Your flash card has been saved",
                    data: {
                        ...saveFlashCard,
                        createdAt: convertTimestamp(saveFlashCard.createdAt),
                    },
                };
            } else {
                return { message: "Your flash card has not been saved" };
            }
        },
        async updateFlashCard(_: any, args: editFlashCardProps, contextValue: loggedInUser) {
            if (!contextValue.user)
                return { message: "Please login to create a new topic" };
            const checkCard = await prisma.flashCard.findFirst({
                where: { id: args.fc_id, userId: contextValue.user.id },
            });
            if (!checkCard)
                return {
                    message: `We can not find flash card with ${args.fc_id} in your account.`,
                };
            const editedCard = {
                reference: args.reference,
                question: args.question,
                answer: args.answer,
                topicId: args.topicId,
            };
            const updateFlashCard = await prisma.flashCard.update({
                where: { id: args.fc_id },
                data: editedCard,
            });
            if (updateFlashCard) {
                return { message: "Flash card updated successfully" };
            } else {
                return { message: "Flash card not updated successfully." };
            }
        },
        async deleteFlashCard(_: any, args: singleFlashCardProp, contextValue: loggedInUser) {
            if (!contextValue.user)
                return { message: "Please login to create a new topic" };
            const isAvailable = await prisma.flashCard.findFirst({
                where: { id: args.flashcard, userId: contextValue.user.id },
            });
            if (isAvailable) {
                const deleteFc = await prisma.flashCard.delete({
                    where: { id: args.flashcard },
                });
                if (deleteFc) return { message: "Flash card deleted successfully." };
            }
            return { message: "We can not delete due to missing flashcard." };
        },
        async changeStatus(_: any, args: statusFlashCardProps, contextValue: loggedInUser) {
            if (!contextValue.user)
                return { message: "Please login to create a new topic" };
            const checkCard = await prisma.flashCard.findFirst({
                where: { id: args.fc_id, userId: contextValue.user.id },
            });
            if (!checkCard)
                return {
                    message: `We can not find flash card with ${args.fc_id} in your account.`,
                };
            const changeStatus = await prisma.flashCard.update({
                where: { id: args.fc_id },
                data: { isFlipped: !checkCard.isFlipped },
            });
            if (changeStatus)
                return {
                    message: "Status updated successfully.",
                    status: changeStatus.isFlipped,
                };
        },

        // Topic mutatins
        async createNewTopic(_: any, args: CreateTopicProps, contextValue: loggedInUser) {
            if (!contextValue.user)
                return { message: "Please login to create a new topic" };
            const newTopic: CreateTopicProps = {
                name: args.name.toLowerCase(),
                description: args.description,
                userId: contextValue.user.id,
            };
            const foundMatch = await prisma.topic.findFirst({
                where: { name: newTopic.name },
            }); // check topic existence
            if (foundMatch)
                return { message: `'${newTopic.name}' already found in your account.` };
            const saveTopic = await prisma.topic.create({ data: newTopic });
            return {
                message: `'${saveTopic.name}' is saved successfully.`,
                data: {
                    ...saveTopic,
                    createdAt: convertTimestamp(saveTopic.createdAt),
                },
            };
        },
        async editTopic(_: any, args: EditTopicProps, contextValue: loggedInUser) {
            if (!contextValue.user)
                return { message: "Please login to create a new topic" };
            const editedTopic = { name: args.name, description: args.description };
            const checkMatch = await prisma.topic.findFirst({
                where: { id: args.tp_id, userId: contextValue.user.id },
            });
            if (!checkMatch)
                return {
                    message: "We can not find matching topic with id: " + args.tp_id,
                };
            const updateTopic = await prisma.topic.update({
                where: { id: args.tp_id },
                data: editedTopic,
            });
            if (updateTopic) return { message: "Updated your topic successfully!" };
            return { message: "Problem while updating your topic." };
        },
        async deleteTopic(_: any, args: DeleteTopicProps, contextValue: loggedInUser) {
            if (!contextValue.user)
                return { message: "Please login to create a new topic" };
            const checkMatch = await prisma.topic.findFirst({
                where: { id: args.tp_id, userId: contextValue.user.id },
            });
            if (!checkMatch)
                return { message: `We can not find matching topic with id: ${args.tp_id} Or you are not the owner of this topic.` };
            await prisma.topic.delete({ where: { id: args.tp_id } });
            return { message: "Your topic has been deleted" };
        },
    },
};
