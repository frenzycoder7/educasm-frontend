import { useState, useEffect } from "react";
import InitialViewComponent from "../explore/components/InitialViewComponent";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SessionStats, Stats } from "./interfaces";
import { TestSettingsModal } from "./components/TestSettingsModal";
import { TestView } from "./components/TestView";
import { IQuestion } from "../../../apis/response_interfaces/question-interface";
import { TestResultView } from './components/TestResultView';
import { useGenerateQuestion } from "../../../hooks/useGenerateQuestion";

const initialStats: Stats = {
    questions: 0,
    accuracy: 0,
    streak: 0,
    bestStreak: 0,
    avgTime: 0,
}

const initialSessionStats: SessionStats = {
    totalQuestions: 0,
    sessionLimit: 25,
    isSessionComplete: false,
}

export const PlaygroundView = () => {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<IQuestion | null>(null);
    const { mutate, isPending } = useGenerateQuestion();
    const { user, isLoggedIn } = useSelector((state: RootState) => state.user);

    const [isPaused, setIsPaused] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentQuestionTime, setCurrentQuestionTime] = useState<number>(0);
    const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
    const [sessionStats, setSessionStats] = useState<SessionStats>(initialSessionStats);
    const [stats, setStats] = useState<Stats>(initialStats);
    const [timePerQuestion, setTimePerQuestion] = useState<number>(10);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (isTestStarted && !isPaused && !showExplanation && currentQuestion) {
            const timer = setTimeout(() => {
                toast.error("Time's up!");
                setShowExplanation(true);
                setSelectedAnswer(null);

                setStats(prev => ({
                    questions: prev.questions + 1,
                    accuracy: (prev.accuracy * prev.questions) / (prev.questions + 1),
                    streak: 0,
                    bestStreak: prev.bestStreak,
                    avgTime: ((prev.avgTime * prev.questions) + timePerQuestion) / (prev.questions + 1)
                }));

                setTimeout(() => {
                    handleNextQuestion();
                }, 2000);

            }, timePerQuestion * 1000);

            return () => clearTimeout(timer);
        }
    }, [currentQuestion, isPaused, isTestStarted, showExplanation]);


    const age = user?.age || 25;

    if (!isLoggedIn) {
        return <Navigate to="/" />
    }




    const handleClearTopic = (topicToRemove: string) => {
        setSelectedTopics(prev => prev.filter(topic => topic !== topicToRemove));
    };

    const handleSearch = (topic: string) => {
        setSelectedTopics([...selectedTopics, topic]);
    };

    const handleStartTest = () => {
        if (selectedTopics.length === 0) {
            toast.error("Please select at least one topic");
            return;
        }
        setShowSettingsModal(true);
    };

    const handleTestSettingsSubmit = (settings: { questionCount: number; }) => {
        if (timePerQuestion < 10) {
            toast.error("Please enter a number between 10 and 300");
            return;
        }
        setShowSettingsModal(false);
        setSessionStats(prev => ({
            ...prev,
            sessionLimit: settings.questionCount
        }));
        fetchQuestion();
        setIsTestStarted(true);
    };

    const fetchQuestion = () => {
        mutate({ topic: selectedTopics.join(","), age, level: 1 }, {
            onSuccess(data) {
                setCurrentQuestion(data);
                setSelectedAnswer(null);
                setShowExplanation(false);
                setCurrentQuestionTime(timePerQuestion);
                startQuestionTimer();
            },
        });
    };


    const startQuestionTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
        if (currentQuestionTime === 0) {
            setCurrentQuestionTime(timePerQuestion);
        }
        const interval = setInterval(() => {
            setCurrentQuestionTime(prev => {
                if (prev <= 0) return 0;
                return prev - 1;
            });
        }, 1000);
        setTimerInterval(interval);
    };

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer !== null || !currentQuestion) return;
        setSelectedAnswer(index);
        setShowExplanation(true);
        if (timerInterval) clearInterval(timerInterval);

        const isCorrect = index === currentQuestion.correctAnswer;
        setStats(prev => ({
            questions: prev.questions + 1,
            accuracy: ((prev.accuracy * prev.questions) + (isCorrect ? 100 : 0)) / (prev.questions + 1),
            streak: isCorrect ? prev.streak + 1 : 0,
            bestStreak: isCorrect ? Math.max(prev.streak + 1, prev.bestStreak) : prev.bestStreak,
            avgTime: ((prev.avgTime * prev.questions) + (timePerQuestion - currentQuestionTime)) / (prev.questions + 1)
        }));
    };

    const handleNextQuestion = () => {
        if (sessionStats.totalQuestions + 1 >= sessionStats.sessionLimit) {
            handleEndTest();
            return;
        }
        setSessionStats(prev => ({
            ...prev,
            totalQuestions: prev.totalQuestions + 1
        }));
        fetchQuestion();
    };

    const handleEndTest = () => {
        if (timerInterval) clearInterval(timerInterval);
        setShowResults(true);
    };

    const handleStartAgain = () => {
        setSessionStats(prev => ({
            ...initialSessionStats,
            sessionLimit: prev.sessionLimit
        }));
        handleTestSettingsSubmit({ questionCount: sessionStats.sessionLimit });
    };

    const handleClose = () => {
        setShowResults(false);
        setIsTestStarted(false);
        setCurrentQuestion(null);
        setStats(initialStats);
        setSessionStats(initialSessionStats);
        setSelectedTopics([]);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        } else if (!showExplanation) {
            const interval = setInterval(() => {
                setCurrentQuestionTime(prev => {
                    if (prev <= 0) return 0;
                    return prev - 1;
                });
            }, 1000);
            setTimerInterval(interval);
        }
    };

    return (
        <>
            {!isTestStarted ? (
                <InitialViewComponent
                    onSearch={handleSearch}
                    isPlayground={true}
                    onStartTest={handleStartTest}
                    selectedTopics={selectedTopics}
                    onClearTopic={handleClearTopic}
                />
            ) : (
                <TestView
                    question={currentQuestion}
                    isLoading={isPending}
                    stats={{
                        accuracy: Math.round(stats.accuracy),
                        questionsAnswered: stats.questions,
                        streak: stats.streak,
                        timeRemaining: currentQuestionTime
                    }}
                    selectedAnswer={selectedAnswer}
                    onSelectAnswer={handleAnswerSelect}
                    onNextQuestion={handleNextQuestion}
                    onEndTest={handleEndTest}
                    isPaused={isPaused}
                    onTogglePause={togglePause}
                    showExplanation={showExplanation}
                />
            )}

            <TestSettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                onStart={handleTestSettingsSubmit}
                setTimePerQuestion={setTimePerQuestion}
            />

            {showResults && (
                <TestResultView
                    stats={{
                        accuracy: Math.round(stats.accuracy),
                        questionsAnswered: stats.questions,
                        streak: stats.streak,
                        bestStreak: stats.bestStreak,
                        avgTime: stats.avgTime,
                        totalQuestions: sessionStats.sessionLimit,
                        timePerQuestion: timePerQuestion
                    }}
                    onStartAgain={() => {
                        setCurrentQuestion(null);
                        setStats(initialStats);
                        setShowResults(false);
                        handleStartAgain();
                    }}
                    onClose={handleClose}
                />
            )}
        </>
    );
}; 