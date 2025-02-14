export interface IExploreContent {
    messageId: string,
    type: string,
    content: {
        paragraph1: string,
        paragraph2: string,
        paragraph3: string
    } | string,
    code: {
        summary: string,
        language: string,
        code: string
    },
    topics: {
        topic: string,
        type: string,
        reason: string
    }[],
    questions: {
        question: string,
        type: string,
        context: string
    }[]
}