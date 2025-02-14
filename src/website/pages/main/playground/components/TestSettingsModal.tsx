import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface TestSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (settings: { questionCount: number; }) => void;
    setTimePerQuestion: (timePerQuestion: number) => void;
}

export const TestSettingsModal: React.FC<TestSettingsModalProps> = ({ isOpen, onClose, onStart, setTimePerQuestion }) => {
    const [questionCount, setQuestionCount] = useState(10);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (questionCount < 1 || questionCount > 100) {
            toast.error("Please enter a number between 1 and 100");
            return;
        }
        onStart({ questionCount });
    };



    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Test Settings</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Number of Questions
                                </label>
                                <motion.input
                                    type="number"
                                    min={1}
                                    max={50}
                                    value={questionCount}
                                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Time per Question (seconds)
                                </label>
                                <motion.input
                                    type="number"
                                    min={10}
                                    max={300}
                                    placeholder='by default 10 seconds'
                                    onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white transition-colors"
                                >
                                    Start Test
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 