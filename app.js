document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const mainMenu = document.getElementById("main-menu");
    const optionsMenu = document.getElementById("options-menu");
    const trainingSection = document.getElementById("training-section");
    const question = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const submitAnswerBtn = document.getElementById("submit-answer");
    const feedback = document.getElementById("feedback");

    const addWordsForm = document.getElementById("add-words-form");
    const wordPairsInput = document.getElementById("word-pairs");
    const backToMainBtn = document.getElementById("back-to-main");
    const startLessonBtn = document.getElementById("start-lesson");
    const openOptionsBtn = document.getElementById("open-options");

    // Stored vocabulary
    let storedWords = JSON.parse(localStorage.getItem("storedWords")) || [];
    let currentLesson = [];
    let currentIndex = 0;

    // Navigation Functions
    const showMainMenu = () => {
        mainMenu.style.display = "block";
        optionsMenu.style.display = "none";
        trainingSection.style.display = "none";
    };

    const showOptionsMenu = () => {
        mainMenu.style.display = "none";
        optionsMenu.style.display = "block";
        trainingSection.style.display = "none";
    };

    const showTrainingSection = () => {
        mainMenu.style.display = "none";
        optionsMenu.style.display = "none";
        trainingSection.style.display = "block";
    };

    // Options Menu: Add Words
    addWordsForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const rawInput = wordPairsInput.value.trim();
        if (!rawInput) {
            alert("Please enter some words.");
            return;
        }

        // Split input by newlines or commas
        const lines = rawInput.split(/\n|,/).map((item) => item.trim());

        // Validate and create word pairs
        const newWords = [];
        for (let i = 0; i < lines.length; i += 2) {
            if (lines[i] && lines[i + 1]) {
                newWords.push({ english: lines[i], polish: lines[i + 1] });
            }
        }

        if (newWords.length === 0) {
            alert("Invalid input. Please enter valid word pairs (e.g., 'cat,kot').");
            return;
        }

        // Save new words to storage
        storedWords = [...storedWords, ...newWords];
        localStorage.setItem("storedWords", JSON.stringify(storedWords));
        wordPairsInput.value = ""; // Clear input
        alert(`${newWords.length} words added successfully!`);
    });

    // Start a New Lesson
    startLessonBtn.addEventListener("click", () => {
        if (storedWords.length < 10) {
            alert("You need at least 10 words to start a lesson.");
            return;
        }

        // Randomly select 10 words
        currentLesson = [...storedWords]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        currentIndex = 0;
        showTrainingSection();
        askQuestion();
    });

    // Ask a Question
    const askQuestion = () => {
        const currentWord = currentLesson[currentIndex];
        question.textContent = `Translate this word: ${currentWord.english}`;
        feedback.style.visibility = "hidden"; // Hide feedback for new question
        feedback.textContent = ""; // Clear previous feedback
        answerInput.value = ""; // Clear input field
        answerInput.focus();
    };

    // Check the User's Answer
    submitAnswerBtn.addEventListener("click", () => {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const currentWord = currentLesson[currentIndex];

        // Make feedback visible
        feedback.style.visibility = "visible";

        if (userAnswer === currentWord.polish.toLowerCase()) {
            feedback.textContent = `Correct! The translation of "${currentWord.english}" is "${currentWord.polish}".`;
            feedback.style.color = "green";
            // Move to the next word
            currentIndex++;
            if (currentIndex >= currentLesson.length) {
                alert("Lesson complete!");
                showMainMenu();
                return;
            }
        } else {
            feedback.textContent = `Incorrect! The correct translation of "${currentWord.english}" is "${currentWord.polish}".`;
            feedback.style.color = "red";
            // Move the current word to the end of the list
            currentLesson.push(currentLesson.splice(currentIndex, 1)[0]);
        }

        // Delay before showing the next question
        setTimeout(() => {
            askQuestion();
        }, 1000);
    });

    // Navigation Buttons
    openOptionsBtn.addEventListener("click", showOptionsMenu);
    backToMainBtn.addEventListener("click", showMainMenu);

    // Show Main Menu on Load
    showMainMenu();
});
