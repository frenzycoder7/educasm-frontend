import { SearchBar } from './SearchBar'
import { motion } from 'framer-motion';

export default function InitialViewComponent({
    onSearch,
    isPlayground = false,
    onStartTest,
    selectedTopics,
    onClearTopic
}: {
    onSearch: (query: string) => void,
    isPlayground: boolean,
    onStartTest?: () => void,
    selectedTopics?: string[],
    onClearTopic?: (topic: string) => void
}) {
    console.log(selectedTopics)
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="w-full max-w-xl lg:max-w-2xl mx-auto text-center space-y-6 sm:space-y-8"
            >
                <motion.div variants={item} className="space-y-3 sm:space-y-4">
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text leading-tight"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {isPlayground ? "What do you want to practice?" : "What do you want to explore?"}
                    </motion.h1>
                    <motion.p
                        className="text-base sm:text-lg md:text-xl text-gray-400 px-4"
                        variants={item}
                    >
                        {isPlayground ? "Practice anything, discover everything" : "Ask anything, discover everything"}
                    </motion.p>
                </motion.div>

                <motion.div variants={item} className="w-full px-4 sm:px-8 md:px-12">
                    <SearchBar
                        onSearch={onSearch}
                        placeholder={isPlayground ? "Enter what you want to practice..." : "Enter what you want to explore..."}
                        centered={true}
                        className="bg-gray-900/80 backdrop-blur-lg"
                        selectedTopics={selectedTopics}
                        onClearTopic={onClearTopic}
                        isPlayground={isPlayground}
                    />
                    <p className="text-xs sm:text-sm text-gray-400 mt-2">
                        Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}K to search anytime
                    </p>
                </motion.div>

                {isPlayground && onStartTest && (
                    <motion.div
                        variants={item}
                        className="w-full flex justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStartTest}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                                text-white font-semibold text-lg shadow-lg hover:shadow-xl
                                transition-all duration-300 hover:-translate-y-0.5
                                border border-purple-400/30"
                        >
                            Start Test 🚀
                        </motion.button>
                    </motion.div>
                )}

                <motion.div
                    variants={item}
                    className="space-y-4 px-2 sm:px-4"
                >
                    <p className="text-xs sm:text-sm text-gray-400">Popular topics to explore</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSearch("Quantum Physics")}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 
                                border border-purple-500/30 transition-all duration-300 text-xs sm:text-sm text-purple-300
                                hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5"
                        >
                            ⚛️ Quantum Physics
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSearch("Machine Learning")}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 
                                border border-blue-500/30 transition-all duration-300 text-xs sm:text-sm text-blue-300
                                hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
                        >
                            🤖 Machine Learning
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSearch("World History")}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 
                                border border-green-500/30 transition-all duration-300 text-xs sm:text-sm text-green-300
                                hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-0.5"
                        >
                            🌍 World History
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSearch("Space Exploration")}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 
                                border border-yellow-500/30 transition-all duration-300 text-xs sm:text-sm text-yellow-300
                                hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-0.5"
                        >
                            🚀 Space Exploration
                        </motion.button>
                    </div>
                </motion.div>

                <motion.div
                    variants={item}
                    className="text-xs sm:text-sm text-gray-500 mt-8"
                >
                    <p>Powered by AI • Built for learning</p>
                </motion.div>
            </motion.div>
        </div>
    )
}
