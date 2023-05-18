export interface createFlashCardProps {
    question: string,
    answer: string,
    topic: string
}

export interface editFlashCardProps {
    fc_id: number
    question: string,
    answer: string,
    topic: string
}

export interface statusFlashCardProps {
    fc_id: number
    status: boolean
}

export interface singleFlashCardProp {
    flashcard: number
}