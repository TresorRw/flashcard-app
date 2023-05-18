export interface createFlashCartProps {
    question: string,
    answer: string,
    topic: string
}

export interface editFlashCartProps {
    fc_id: number
    question: string,
    answer: string,
    topic: string
}