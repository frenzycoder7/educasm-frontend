import React from 'react'
import { IExploreContent } from '../../../../apis/response_interfaces/explore-data.interface'
import MessagesComponent from './MessagesComponent'
import { SearchBar } from './SearchBar'
import { motion, AnimatePresence } from 'framer-motion'

export default function MessageListViewComponent({
    messages,
    loadMessage,
    scrollRef
}: { messages: IExploreContent[], loadMessage: (query: string) => void, scrollRef: React.RefObject<HTMLDivElement> }) {
    const messageCount = messages.length;
    const isLastMessageUser = (index: number) => {
        return index === messageCount - 1;
    }
    return (
        <div className="fixed inset-x-0 top-16 bottom-0">
            <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                        <div className="py-8 space-y-4">
                            <AnimatePresence initial={false}>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={message.messageId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: message.type === 'user' ? 100 : -100 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <MessagesComponent
                                            message={message}
                                            onRelatedQueryClick={loadMessage}
                                            isLastMessageUser={isLastMessageUser(index)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div
                                ref={scrollRef}
                                className="h-4 w-full"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 mb-10">
                    <div className="bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pb-6 pt-6">
                        <div className="max-w-3xl mx-auto px-4 sm:px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-2 shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <SearchBar
                                    onSearch={loadMessage}
                                    placeholder="Ask a follow-up question..."
                                    centered={false}
                                    className="bg-transparent border-none h-10 focus:ring-0"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
