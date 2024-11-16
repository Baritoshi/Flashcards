document.addEventListener("DOMContentLoaded", () => {
    const vocabForm = document.getElementById("vocab-form");
    const vocabListInput = document.getElementById("vocab-list");
    const trainingSection = document.getElementById("training-section");
    const question = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const submitAnswerBtn = document.getElementById("submit-answer");
    const feedback = document.getElementById("feedback");

    let vocabulary = []; // Array to hold vocabulary pairs
    let currentIndex = 0; // Track current word index

    // Parse vocabulary and start training
    vocabForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const rawInput = vocabListInput.value.trim();
        if (!rawInput) {
            alert("Please enter a vocabulary list.");
            return;
        }

        vocabulary = rawInput.split(',').reduce((acc, word, idx, arr) => {
            if (idx % 2 === 0) acc.push({ english: word, polish: arr[idx + 1] || "" });
            return acc;
        }, []);

        if (vocabulary.length === 0) {
            alert("Invalid input. Please enter pairs in the format: word1,word2,word3,word4...");
            return;
        }

        vocabForm.style.display = "none";
        trainingSection.style.display = "block";

        askQuestion();
    });

    // Display the current question
    const askQuestion = () => {
        const currentWord = vocabulary[currentIndex];
        question.textContent = `Translate this word: ${currentWord.english}`;
        feedback.textContent = ""; // Clear feedback
        answerInput.value = ""; // Clear input
        answerInput.focus();
    };

    // Check the user's answer
    submitAnswerBtn.addEventListener("click", () => {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const currentWord = vocabulary[currentIndex];

        if (userAnswer === currentWord.polish.toLowerCase()) {
            feedback.textContent = "Correct!";
            feedback.style.color = "green";
            // Move to the next word
            currentIndex++;
            if (currentIndex >= vocabulary.length) {
                currentIndex = 0; // Loop back if needed
                alert("You've completed one round of practice!");
            }
        } else {
            feedback.textContent = `Incorrect! The correct translation is "${currentWord.polish}".`;
            feedback.style.color = "red";
            // Move the current word to the end
            vocabulary.push(vocabulary.splice(currentIndex, 1)[0]);
        }

        askQuestion();
    });
});
