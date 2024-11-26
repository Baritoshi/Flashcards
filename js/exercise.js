let currentIndex = 0;
let correctFirstTryCount = 0;
let firstTimeMistakeCount = 0;
let incorrectWords = [];

export const askQuestion = (currentLesson, updateCounters, showIncorrectWords) => {
    if (currentIndex >= currentLesson.length) {
        showIncorrectWords(incorrectWords);
        return;
    }

    const word = currentLesson[currentIndex];
    const questionElement = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const feedback = document.getElementById("feedback");

    questionElement.textContent = `Translate: ${word.english}`;
    feedback.style.visibility = "hidden";
    answerInput.value = "";
    answerInput.focus();
};

export const checkAnswer = (currentLesson, updateCounters, showIncorrectWords) => {
    const answerInput = document.getElementById("answer");
    const feedback = document.getElementById("feedback");
    const userAnswer = answerInput.value.trim().toLowerCase();
    const word = currentLesson[currentIndex];

    feedback.style.visibility = "visible";

    if (userAnswer === word.polish.toLowerCase()) {
        feedback.textContent = "Correct!";
        feedback.style.color = "green";
        correctFirstTryCount++;
    } else {
        feedback.textContent = `Incorrect! Correct answer: ${word.polish}`;
        feedback.style.color = "red";
        firstTimeMistakeCount++;
        if (!incorrectWords.some(w => w.english === word.english)) {
            incorrectWords.push(word);
        }
    }

    updateCounters(correctFirstTryCount, firstTimeMistakeCount);

    currentIndex++;
    setTimeout(() => askQuestion(currentLesson, updateCounters, showIncorrectWords), 1000);
};

export const updateCounters = (correctCount, mistakeCount) => {
    const correctCounter = document.getElementById("correct-counter");
    const mistakeCounter = document.getElementById("mistake-counter");

    correctCounter.textContent = correctCount;
    mistakeCounter.textContent = mistakeCount;
};

export const showIncorrectWords = (incorrectWords) => {
    const incorrectWordsSection = document.getElementById("incorrect-words");
    const incorrectWordsList = document.getElementById("incorrect-words-list");
    const backToMainAfterLesson = document.getElementById("back-to-main-after-lesson");

    incorrectWordsList.innerHTML = "";

    if (incorrectWords.length > 0) {
        incorrectWords.forEach((word) => {
            const li = document.createElement("li");
            li.textContent = `${word.english} → ${word.polish}`;
            incorrectWordsList.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "Great job! No mistakes.";
        incorrectWordsList.appendChild(li);
    }

    incorrectWordsSection.style.display = "block";
    backToMainAfterLesson.style.display = "inline-block";

    backToMainAfterLesson.addEventListener("click", () => {
        incorrectWordsSection.style.display = "none";
        location.reload();
    });
};
