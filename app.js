document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const mainMenu = document.getElementById("main-menu");
    const optionsMenu = document.getElementById("options-menu");
    const wordEditor = document.getElementById("word-editor");
    const wordTableBody = document.querySelector("#word-table tbody");

    const addWordsForm = document.getElementById("add-words-form");
    const wordPairsInput = document.getElementById("word-pairs");
    const backToMainBtn = document.getElementById("back-to-main");
    const openOptionsBtn = document.getElementById("open-options");

    const trainingSection = document.getElementById("training-section");
    const question = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const submitAnswerBtn = document.getElementById("submit-answer");
    const feedback = document.getElementById("feedback");
    const correctCounter = document.getElementById("correct-counter");
    const mistakeCounter = document.getElementById("mistake-counter");

    const incorrectWordsSection = document.getElementById("incorrect-words");
    const incorrectWordsList = document.getElementById("incorrect-words-list");

    // Stored vocabulary
    let storedWords = JSON.parse(localStorage.getItem("storedWords")) || [];
    let currentLesson = [];
    let currentIndex = 0;

    // Initialize counters and tracking arrays
    let correctFirstTryCount = 0;
    let firstTimeMistakeCount = 0;
    let firstAttemptFlags = [];
    let incorrectWords = []; // Track incorrect words

    // Navigation Functions
    const showMainMenu = () => {
        mainMenu.style.display = "block";
        optionsMenu.style.display = "none";
        trainingSection.style.display = "none";
        wordEditor.style.display = "none";
        incorrectWordsSection.style.display = "none"; // Hide incorrect words section
    };

    const showOptionsMenu = () => {
        mainMenu.style.display = "none";
        optionsMenu.style.display = "block";
        trainingSection.style.display = "none";
        renderWordEditor();
    };

    const showTrainingSection = () => {
        mainMenu.style.display = "none";
        optionsMenu.style.display = "none";
        trainingSection.style.display = "block";
        incorrectWordsSection.style.display = "none"; // Hide incorrect words during the lesson
    };

    // Render Word Editor
    const renderWordEditor = () => {
        wordEditor.style.display = "block";
        wordTableBody.innerHTML = "";

        storedWords.forEach((word, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td contenteditable="true" class="edit-english">${word.english}</td>
                <td contenteditable="true" class="edit-polish">${word.polish}</td>
                <td class="word-actions">
                    <button class="save-button" data-index="${index}">Save</button>
                    <button class="delete-button" data-index="${index}">Delete</button>
                </td>
            `;
            wordTableBody.appendChild(row);
        });

        document.querySelectorAll(".save-button").forEach((button) =>
            button.addEventListener("click", handleSaveWord)
        );
        document.querySelectorAll(".delete-button").forEach((button) =>
            button.addEventListener("click", handleDeleteWord)
        );
    };

    // Save Edited Word
    const handleSaveWord = (event) => {
        const index = event.target.dataset.index;
        const row = event.target.closest("tr");
        const editedEnglish = row.querySelector(".edit-english").textContent.trim();
        const editedPolish = row.querySelector(".edit-polish").textContent.trim();

        storedWords[index] = { english: editedEnglish, polish: editedPolish };
        localStorage.setItem("storedWords", JSON.stringify(storedWords));
        alert("Word updated successfully!");
    };

    // Delete Word
    const handleDeleteWord = (event) => {
        const index = event.target.dataset.index;
        storedWords.splice(index, 1);
        localStorage.setItem("storedWords", JSON.stringify(storedWords));
        renderWordEditor();
    };

    // Add Words
    addWordsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const rawInput = wordPairsInput.value.trim();
        if (!rawInput) return alert("Please enter some words.");
        const lines = rawInput.split(/\n|,/).map((item) => item.trim());
        const newWords = [];
        for (let i = 0; i < lines.length; i += 2) {
            if (lines[i] && lines[i + 1]) {
                newWords.push({ english: lines[i], polish: lines[i + 1] });
            }
        }
        storedWords = [...storedWords, ...newWords];
        localStorage.setItem("storedWords", JSON.stringify(storedWords));
        wordPairsInput.value = "";
        renderWordEditor();
    });

    // Start Lesson
    const startLesson = () => {
        if (storedWords.length < 10) {
            alert("You need at least 10 words to start a lesson.");
            return;
        }

        // Reset counters and tracking arrays
        correctFirstTryCount = 0;
        firstTimeMistakeCount = 0;
        firstAttemptFlags = Array(10).fill(true);
        incorrectWords = [];

        // Select 10 random words
        currentLesson = [...storedWords]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        currentIndex = 0;

        showTrainingSection();
        updateCounters();
        askQuestion();
    };

    // Update Counters
    const updateCounters = () => {
        correctCounter.textContent = correctFirstTryCount;
        mistakeCounter.textContent = firstTimeMistakeCount;
    };

    // Ask a Question
    const askQuestion = () => {
        if (currentIndex >= currentLesson.length) {
            displayIncorrectWords();
            return;
        }

        const currentWord = currentLesson[currentIndex];
        question.textContent = `Translate this word: ${currentWord.english}`;
        feedback.style.visibility = "hidden";
        feedback.textContent = "";
        answerInput.value = "";
        answerInput.focus();
    };

    // Check Answer
    const checkAnswer = () => {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const currentWord = currentLesson[currentIndex];

        feedback.style.visibility = "visible";

        if (userAnswer === currentWord.polish.toLowerCase()) {
            feedback.textContent = `Correct! "${currentWord.english}" translates to "${currentWord.polish}".`;
            feedback.style.color = "green";

            if (firstAttemptFlags[currentIndex]) {
                correctFirstTryCount++;
                firstAttemptFlags[currentIndex] = false;
            }

            currentIndex++;
        } else {
            feedback.textContent = `Incorrect! "${currentWord.english}" translates to "${currentWord.polish}".`;
            feedback.style.color = "red";

            if (firstAttemptFlags[currentIndex]) {
                firstTimeMistakeCount++;
                firstAttemptFlags[currentIndex] = false;

                // Add to incorrect words if not already added
                if (!incorrectWords.some(word => word.english === currentWord.english)) {
                    incorrectWords.push(currentWord);
                }
            }

            currentLesson.push(currentLesson.splice(currentIndex, 1)[0]);
        }

        updateCounters();
        setTimeout(() => askQuestion(), 1000);
    };

    // Display Incorrect Words and Show Back to Main Button
	const displayIncorrectWords = () => {
    incorrectWordsList.innerHTML = ""; // Clear previous list

    if (incorrectWords.length > 0) {
        incorrectWords.forEach(word => {
            const li = document.createElement("li");
            li.textContent = `${word.english} → ${word.polish}`;
            incorrectWordsList.appendChild(li);
        });

        incorrectWordsSection.style.display = "block"; // Show the incorrect words section
    } else {
        incorrectWordsSection.style.display = "block";
        incorrectWordsList.innerHTML = "<li>Great job! You got all words correct.</li>";
    }

    // Show the Back to Main Menu button
    const backToMainButton = document.getElementById("back-to-main-after-lesson");
    backToMainButton.style.display = "inline-block"; // Make button visible
    backToMainButton.addEventListener("click", showMainMenu); // Attach event listener
};


    // Event Listeners
    submitAnswerBtn.addEventListener("click", checkAnswer);
    openOptionsBtn.addEventListener("click", showOptionsMenu);
    backToMainBtn.addEventListener("click", showMainMenu);
    document.getElementById("start-lesson").addEventListener("click", startLesson);

    // Initialize App
    showMainMenu();
});
