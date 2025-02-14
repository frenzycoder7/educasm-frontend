/**
 * {
    "text": "In modern JavaScript frameworks like React and Vue.js, how is 'undefined' increasingly being handled to prevent common errors related to missing data in components?",
    "options": [
        "Through the use of optional chaining and nullish coalescing operators for safer property access.",
        "By globally replacing all 'undefined' values with a default placeholder value using a build-time script.",
        "By throwing exceptions when 'undefined' values are encountered to force explicit handling.",
        "By automatically converting 'undefined' values to empty strings during component rendering."
    ],
    "correctAnswer": 0,
    "explanation": {
        "correct": "Optional chaining and nullish coalescing allow safer access to nested properties, preventing errors.",
        "key_point": "Safer property access."
    },
    "difficulty": 2,
    "topic": "JavaScript",
    "subtopic": "Undefined Handling",
    "questionType": "Conceptual",
    "ageGroup": "25"
}
 */

export interface IQuestion {
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: {
        correct: string;
        key_point: string;
    };
    difficulty: number;
    topic: string;
    subtopic: string;
    questionType: string;
    ageGroup: string;
}