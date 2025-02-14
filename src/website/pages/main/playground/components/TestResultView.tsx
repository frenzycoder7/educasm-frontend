import { motion } from 'framer-motion';
import { Trophy, Target, Award, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface TestResultViewProps {
    stats: {
        accuracy: number;
        questionsAnswered: number;
        streak: number;
        avgTime: number;
        bestStreak: number;
        totalQuestions: number;
        timePerQuestion: number;
    };
    onStartAgain: ({ questionCount }: { questionCount: number }) => void;
    onClose: () => void;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
    stats,
    onStartAgain,
    onClose,
}) => {
    useEffect(() => {
        // Trigger confetti animation when component mounts
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-lg"
            >
                <div className="text-center mb-8">
                    <motion.h2
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                        Test Completed! 🎉
                    </motion.h2>
                    <p className="text-gray-400">Here's how you performed</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-700/50 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            <span className="text-gray-300">Accuracy</span>
                        </div>
                        <span className="text-3xl font-bold text-white">{stats.accuracy}%</span>
                    </motion.div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-700/50 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-blue-400" />
                            <span className="text-gray-300">Questions</span>
                        </div>
                        <span className="text-3xl font-bold text-white">{stats.questionsAnswered}</span>
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-700/50 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-5 h-5 text-purple-400" />
                            <span className="text-gray-300">Best Streak</span>
                        </div>
                        <span className="text-3xl font-bold text-white">{stats.bestStreak}</span>
                    </motion.div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-700/50 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-green-400" />
                            <span className="text-gray-300">Avg Time</span>
                        </div>
                        <span className="text-3xl font-bold text-white">{Math.round(stats.avgTime)}s</span>
                    </motion.div>
                </div>

                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onStartAgain({ questionCount: stats.totalQuestions })}
                        className="flex-1 py-3 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium transition-colors"
                    >
                        Start Again
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                    >
                        Close
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}; 