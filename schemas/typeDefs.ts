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
    }

    type GeneralRegisterMessage {
        message: String!
        data: User
    }

    # Queries
    type Query {
        getUsers: [User!]
        getSingleUser(username: String!): User
        getFlashCards: [FlashCard!]
        getUserFlashCards(userId: Int!): User!
        getSingleFleshCard(flashcard: Int!): FlashCard!
    }

    type Mutation {
        registerUser(username: String!, display_name: String!, password: String!): GeneralRegisterMessage!
        loginUSer(username: String!, password: String!): GeneralLoginMessage!
    }


`