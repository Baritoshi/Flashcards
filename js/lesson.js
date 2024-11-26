import { askQuestion, checkAnswer } from './exercise.js';

export const startLesson = (scheduleLesson, updateCounters, showIncorrectWords) => {
    const currentLesson = scheduleLesson();
    if (currentLesson.length === 0) {
        alert("No words to practice today!");
        return;
    }

    askQuestion(currentLesson, updateCounters, showIncorrectWords);

    document.getElementById("submit-answer").addEventListener("click", () => {
        checkAnswer(currentLesson, updateCounters, showIncorrectWords);
    });

    document.getElementById("answer").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            checkAnswer(currentLesson, updateCounters, showIncorrectWords);
        }
    });
};
