import { renderMemoBoxes, loadMemoBoxes } from './memobox.js';
import { scheduleLesson } from './scheduler.js';
import { startLesson } from './lesson.js';
import { updateCounters, showIncorrectWords } from './exercise.js';

document.addEventListener("DOMContentLoaded", () => {
    const mainMenu = document.getElementById("main-menu");
    const optionsMenu = document.getElementById("options-menu");
    const memoBoxContainer = document.getElementById("memo-boxes");

    const showMainMenu = () => {
        mainMenu.style.display = "block";
        optionsMenu.style.display = "none";
    };

    const showOptionsMenu = () => {
        mainMenu.style.display = "none";
        optionsMenu.style.display = "block";
        renderMemoBoxes(memoBoxContainer);
    };

    document.getElementById("start-lesson").addEventListener("click", () => {
        startLesson(scheduleLesson, updateCounters, showIncorrectWords);
    });

    document.getElementById("open-options").addEventListener("click", showOptionsMenu);
    document.getElementById("back-to-main").addEventListener("click", showMainMenu);

    loadMemoBoxes();
    showMainMenu();
});
