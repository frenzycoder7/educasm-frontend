import remarkGfm from "remark-gfm";
import { LoadingAnimation } from "../../../../../components/shared/LoadingAnimation";
import ReactMarkdown from 'react-markdown';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { RelatedQuestions } from "./RelatedQuestions";
import { RelatedTopics } from "./RelatedTopics";
import { IExploreContent } from "../../../../apis/response_interfaces/explore-data.interface";
import { MarkdownComponents } from "./MarkdownComponent";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { motion } from "framer-motion";

export default function MessagesComponent({ message, onRelatedQueryClick, isLastMessageUser }: {
    message: IExploreContent,
    onRelatedQueryClick: (query: string) => void,
    isLastMessageUser: boolean,
}) {
    const { loadingMessageId, isLoading } = useSelector((state: RootState) => state.messages);
    const getMessage = (message: IExploreContent) => {
        if (typeof message.content === 'string') {
            return message.content;
        }
        return message.content.paragraph1 + '\n' + message.content.paragraph2 + '\n' + message.content.paragraph3;
    }

    const isThinking = (messageId: string) => {
        return loadingMessageId == messageId && isLoading;
    }

    return (
        <motion.div

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {message.type === 'user' ? (
                <div className="w-full">
                    <div className="flex-1 text-base sm:text-lg font-semibold mt-10">
                        {getMessage(message)}
                    </div>
                    {isThinking(message.messageId) && (
                        <motion.div
                            className={`flex items-start justify-start ${isThinking(message.messageId) ? 'h-[70vh]' : 'h-auto'}`}
                        >
                            <motion.div
                                className="flex items-center justify-start"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <LoadingAnimation />
                                <span className="text-sm text-gray-400">Thinking...</span>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            ) : (
                <div className={`${isLastMessageUser ? 'min-h-[70vh]' : 'h-auto'}`}>
                    <div className="flex-1 min-w-0">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                ...MarkdownComponents,
                                p: ({ children }) => (
                                    <motion.p
                                        className="text-sm sm:text-base my-1.5 leading-relaxed break-words"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {children}
                                    </motion.p>
                                ),
                            }}
                            className="prose prose-invert max-w-none"
                        >
                            {getMessage(message)}
                        </ReactMarkdown>

                        {message.code && message.code.code !== "N/A" && message.code.code !== null && message.code.code !== "Not applicable" && (
                            <motion.div
                                className="mt-4 bg-gray-900/50 rounded-lg p-4 border border-gray-700/50"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <pre className="text-sm text-gray-300 overflow-x-auto">
                                    {message.code.code}
                                </pre>
                                <div className="text-sm text-gray-400 mt-2">
                                    {message.code.summary}
                                </div>
                            </motion.div>
                        )}

                        {message.topics && message.topics.length > 0 && (
                            <motion.div
                                className="mt-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <RelatedTopics
                                    topics={message.topics}
                                    onTopicClick={onRelatedQueryClick}
                                />
                            </motion.div>
                        )}

                        {message.questions && message.questions.length > 0 && (
                            <motion.div
                                className="mt-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <RelatedQuestions
                                    questions={message.questions}
                                    onQuestionClick={onRelatedQueryClick}
                                />
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    )
}
