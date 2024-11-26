export const memoBoxes = {
    newWords: [],
    box2: [],
    box3: [],
    box4: [],
    box5: [],
    box6: [],
    masteredWords: []
};

export const loadMemoBoxes = () => {
    const savedData = JSON.parse(localStorage.getItem("memoBoxes"));
    if (savedData) Object.assign(memoBoxes, savedData);
};

export const saveMemoBoxes = () => {
    localStorage.setItem("memoBoxes", JSON.stringify(memoBoxes));
};

export const renderMemoBoxes = (container) => {
    container.innerHTML = "";
    Object.keys(memoBoxes).forEach((box) => {
        const boxDiv = document.createElement("div");
        boxDiv.classList.add("memo-box");

        const boxHeader = document.createElement("h4");
        boxHeader.textContent = `${box.charAt(0).toUpperCase() + box.slice(1)}`;
        boxDiv.appendChild(boxHeader);

        const wordList = document.createElement("ul");
        memoBoxes[box].forEach((word, index) => {
            const wordItem = document.createElement("li");
            wordItem.innerHTML = `
                ${word.english} → ${word.polish}
                <button class="delete-button" data-box="${box}" data-index="${index}">Delete</button>
            `;
            wordList.appendChild(wordItem);
        });

        boxDiv.appendChild(wordList);
        container.appendChild(boxDiv);
    });

    container.querySelectorAll(".delete-button").forEach((button) =>
        button.addEventListener("click", (e) => {
            const box = e.target.dataset.box;
            const index = e.target.dataset.index;
            memoBoxes[box].splice(index, 1);
            saveMemoBoxes();
            renderMemoBoxes(container);
        })
    );
};
