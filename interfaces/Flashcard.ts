export interface createFlashCardProps {
    id: number
    question: string
    answer: string
    isFlipped: Boolean
    reference: string
    topicId: number
}

export interface editFlashCardProps {
    fc_id: number
    question: string
    answer: string
    reference: string
    topicId: number
}

export interface statusFlashCardProps {
    fc_id: number
    status: boolean
}

export interface singleFlashCardProp {
    flashcard: number
}

export interface FlashCardProps {
    id: number
    question: String
    answer: String
    topic: String
    isFlipped: Boolean
    reference: String
    userId: number
    topicId: number
    createdAt: Date
    updatedAt: Date
}
