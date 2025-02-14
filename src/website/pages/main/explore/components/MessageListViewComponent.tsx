import React from 'react'
import { IExploreContent } from '../../../../apis/response_interfaces/explore-data.interface'
import MessagesComponent from './MessagesComponent'
import { SearchBar } from './SearchBar'
import { motion, AnimatePresence } from 'framer-motion'

export default function MessageListViewComponent({ messages, loadMessage, scrollRef }: { messages: IExploreContent[], loadMessage: (query: string) => void, scrollRef: React.RefObject<HTMLDivElement> }) {
    return (
        <div className="fixed inset-x-0 top-16 bottom-0">
            <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-24">
                        <div className="py-8 space-y-4">
                            <AnimatePresence initial={false}>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={message.messageId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: message.type === 'user' ? 100 : -100 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.1,
                                            type: "spring",
                                            stiffness: 100
                                        }}
                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}
                                    >
                                        {message.type !== 'user' && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-2 shadow-lg"
                                            >
                                                <span className="text-white text-sm">AI</span>
                                            </motion.div>
                                        )}
                                        <div
                                            className={`max-w-[85%] sm:max-w-[75%] transform transition-transform duration-200 hover:scale-[1.02] ${message.type === 'user'
                                                ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30'
                                                : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-700/50'
                                                } rounded-2xl border backdrop-blur-sm shadow-lg hover:shadow-xl`}
                                        >
                                            <MessagesComponent
                                                message={message}
                                                onRelatedQueryClick={loadMessage}
                                            />
                                        </div>
                                        {message.type === 'user' && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ml-2 shadow-lg"
                                            >
                                                <span className="text-white text-sm">You</span>
                                            </motion.div>
                                        )}
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
