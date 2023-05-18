export const typeDefs = `#graphql

    type User {
        id: Int!
        display_name: String!
        username: String!
        FlashCards: [FlashCard!]
    }

    type FlashCard {
        id: Int!
        question: String!
        answer: String!
        topic: String!
        isComplete: Boolean!
        addDate: String!
        User: User!
        userId: Int!
    }

    # Messages
    type GeneralLoginMessage {
        message: String!
        data: User
        token: String
    }

    type FlashCardMessage {
        message: String!
        data: FlashCard
    }

    type GeneralRegisterMessage {
        message: String!
        data: User
    }

    type GeneralFlashMessage {
        message: String!
        data: FlashCard
    }

    type StatusChangeMessage {
        message: String!,
        status: Boolean
    }

    # Queries
    type Query {
        getUsers: [User!]
        getSingleUser(username: String!): User
        getFlashCards: [FlashCard!]
        getUserFlashCards(userId: Int!): [FlashCard]
        getSingleFlashCard(flashcard: Int!): FlashCardMessage!
    }

    type Mutation {
        registerUser(username: String!, display_name: String!, password: String!): GeneralRegisterMessage!
        loginUser(username: String!, password: String!): GeneralLoginMessage!
        createFlashCard(question: String!, answer: String!, topic: String!): GeneralFlashMessage!
        updateFlashCard(fc_id: Int!, question: String!, answer: String!, topic: String!): GeneralFlashMessage!
        changeStatus(fc_id: Int!, status: Boolean!): StatusChangeMessage!
    }


`