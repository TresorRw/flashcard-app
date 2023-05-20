export const typeDefs = `#graphql

    type User {
        id: Int!
        display_name: String!
        username: String!
        FlashCards: [FlashCard!]
        Topics: [Topic!]
    }

    type Topic {
        id: Int!
        name: String!
        description: String!
        userId: Int!
        User: User!
        FlashCards: [FlashCard!]
        createdAt: String
        updatedAt: String
    }

    type FlashCard {
        id: Int!
        question: String!
        answer: String!
        isFlipped: Boolean!
        reference: String!
        User: User
        userId: Int!
        Topic: Topic!
        topicId: Int!
        createdAt: String!
        updatedAt: String!
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
    type TopicMessage {
        message: String!
        data: Topic
    }
    type updateDeletedMessage { 
        message: String!
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
        getTopics: [Topic]
    }

    type Mutation {
        # User mutations
        registerUser(username: String!, display_name: String!, password: String!): GeneralRegisterMessage!
        loginUser(username: String!, password: String!): GeneralLoginMessage!
        
        # Flashcard mutations
        createFlashCard(reference: String!, question: String!, answer: String!, topicId: Int!): GeneralFlashMessage!
        updateFlashCard(fc_id: Int!, question: String!, answer: String!, topic: String!): updateDeletedMessage!
        deleteFlashCard(flashcard: Int!): updateDeletedMessage!
        changeStatus(fc_id: Int!, status: Boolean!): StatusChangeMessage!
        
        # Topic Mutations
        createNewTopic(name: String!, description: String!): TopicMessage!
        editTopic(tp_id: Int!, name: String!, description: String!): updateDeletedMessage!
        deleteTopic(tp_id: Int!): updateDeletedMessage!
    }

`