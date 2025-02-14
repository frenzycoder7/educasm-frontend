import { useState, useEffect } from "react";
import InitialViewComponent from "../explore/components/InitialViewComponent";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SessionStats, Stats } from "./interfaces";
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
    sessionLimit: 10,
    isSessionComplete: false,
}

export const PlaygroundView = () => {
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<IQuestion | null>(null);
    const { mutate, isPending, error } = useGenerateQuestion();
    const { user, isLoggedIn } = useSelector((state: RootState) => state.user);

    const [isPaused, setIsPaused] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentQuestionTime, setCurrentQuestionTime] = useState<number>(0);
    const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
    const [sessionStats, setSessionStats] = useState<SessionStats>(initialSessionStats);
    const [stats, setStats] = useState<Stats>(initialStats);
    const [timePerQuestion] = useState<number>(15);
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

    const handleStartTest = (topic: string) => {
        localStorage.removeItem('level');
        localStorage.removeItem('topic');
        localStorage.removeItem('wasCorrect');
        localStorage.setItem("topic", topic);
        setSessionStats(prev => ({
            ...prev,
            sessionLimit: 10
        }));
        fetchQuestion();
        setIsTestStarted(true);
    };


    const fetchQuestion = () => {
        let level = localStorage.getItem("level") ? parseInt(localStorage.getItem("level") || "0") : 1;
        const wasCorrect = localStorage.getItem("wasCorrect") === "true";
        if (wasCorrect) {
            console.log("Previous question was correct increasing level" + level);
            level += 1;
            localStorage.setItem("level", level.toString());
        } else {
            if (level > 0) {
                console.log("Previous question was incorrect decreasing level" + level);
                level -= 1;
                localStorage.setItem("level", level.toString());
            }
        }
        const topic = localStorage.getItem("topic") || "";
        console.log("Fetching question with level" + level);
        console.log("Topic: " + topic);
        console.log("Age: " + age);

        mutate({ topic, age, level: level }, {
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
        localStorage.setItem("wasCorrect", isCorrect.toString());
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
        const topic = localStorage.getItem("topic") || "";
        handleStartTest(topic);
    };

    const handleClose = () => {
        setShowResults(false);
        setIsTestStarted(false);
        setCurrentQuestion(null);
        setStats(initialStats);
        setSessionStats(initialSessionStats);
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
                    onSearch={handleStartTest}
                    isPlayground={true}

                />
            ) : (
                <TestView
                    question={currentQuestion}
                    isLoading={isPending}
                    error={error}
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