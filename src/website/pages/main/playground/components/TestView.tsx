import { IQuestion } from '../../../../apis/response_interfaces/question-interface';
import { Trophy, Timer, Target, Award, Pause, Play, CheckCircle, XCircle } from 'lucide-react';
import { Loading } from '../../../../../components/shared/Loading';
import { motion } from 'framer-motion';

interface TestViewProps {
    question: IQuestion | null;
    isLoading?: boolean;
    stats: {
        accuracy: number;
        questionsAnswered: number;
        streak: number;
        timeRemaining: number;
    };
    selectedAnswer: number | null;
    onSelectAnswer: (index: number) => void;
    onNextQuestion: () => void;
    onEndTest: () => void;
    isPaused: boolean;
    onTogglePause: () => void;
    showExplanation: boolean;
    error: Error | null;
}

export const TestView: React.FC<TestViewProps> = ({
    question,
    isLoading,
    stats,
    selectedAnswer,
    onSelectAnswer,
    onNextQuestion,
    onEndTest,
    isPaused,
    onTogglePause,
    showExplanation,
    error
}) => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
            {/* Stats Header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        <span className="text-sm text-gray-300">Accuracy</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{stats.accuracy}%</span>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-gray-300">Questions</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{stats.questionsAnswered}</span>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-300">Streak</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{stats.streak}</span>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                        <Timer className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-gray-300">Time</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{stats.timeRemaining}s</span>
                </div>
            </div>

            {/* Question Section */}
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <Loading size="lg" />
                </div>
            ) : error ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col justify-center items-center min-h-[300px] p-6"
                >
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center"
                        >
                            <svg
                                className="w-8 h-8 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </motion.div>
                        <p className="text-lg text-gray-300">{error.message}</p>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                            >
                                Try Again
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onEndTest}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                End Test
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            ) : question ? (
                <div className="bg-gray-800/50 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-lg text-white leading-relaxed">{question.text}</h2>
                        <button
                            onClick={onTogglePause}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            {isPaused ? (
                                <Play className="w-5 h-5 text-primary" />
                            ) : (
                                <Pause className="w-5 h-5 text-primary" />
                            )}
                        </button>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => onSelectAnswer(index)}
                                disabled={selectedAnswer !== null}
                                className={`w-full text-left p-4 rounded-lg transition-all
                                    ${selectedAnswer === null
                                        ? 'bg-gray-700/50 hover:bg-gray-700'
                                        : index === question.correctAnswer
                                            ? 'bg-green-500/20 text-green-300'
                                            : selectedAnswer === index
                                                ? 'bg-red-500/20 text-red-300'
                                                : 'bg-gray-700/50'
                                    }`}
                            >
                                <span className="inline-block w-8 font-medium">
                                    {String.fromCharCode(65 + index)}.
                                </span>
                                {option}
                            </button>
                        ))}
                    </div>

                    {/* Explanation */}
                    {showExplanation && (
                        <div className="mt-6 space-y-4">
                            <div className="bg-gray-700/50 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    {selectedAnswer === question.correctAnswer ? (
                                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    )}
                                    <div>
                                        <p className="text-white font-medium">
                                            {selectedAnswer === question.correctAnswer
                                                ? 'Correct!'
                                                : `Incorrect. The right answer is ${String.fromCharCode(65 + question.correctAnswer)}`}
                                        </p>
                                        <p className="text-gray-300 mt-1">{question.explanation.correct}</p>
                                        <p className="text-blue-400 text-sm mt-2">
                                            Key Point: {question.explanation.key_point}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={onNextQuestion}
                                    className="flex-1 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white transition-colors"
                                >
                                    Next Question
                                </button>
                                <button
                                    onClick={onEndTest}
                                    className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                                >
                                    End Test
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}; 