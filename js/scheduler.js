import { memoBoxes } from './memobox.js';

export const scheduleLesson = () => {
    const today = new Date().getDate();
    const lesson = [];
    lesson.push(...memoBoxes.newWords.slice(0, 10));
    lesson.push(...memoBoxes.box2.slice(0, 10));
    if (today % 2 === 0) lesson.push(...memoBoxes.box3.slice(0, 10));
    if (today % 3 === 0) lesson.push(...memoBoxes.box4.slice(0, 10));
    if (today % 4 === 0) lesson.push(...memoBoxes.box5.slice(0, 10));
    if (today % 5 === 0) lesson.push(...memoBoxes.box6.slice(0, 10));

    // Shuffle the lesson array
    for (let i = lesson.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lesson[i], lesson[j]] = [lesson[j], lesson[i]];
    }

    return lesson.slice(0, 10); // Limit to 10 words
};
