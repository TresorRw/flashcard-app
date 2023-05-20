export interface TopicProps {
    id: number
    name: string
    description: string
    userId: number
}

export interface CreateTopicProps {
    userId: number
    name: string
    description: string
}

export interface EditTopicProps {
    tp_id: number
    name: string
    description: string
}

export interface DeleteTopicProps {
    tp_id: number
}