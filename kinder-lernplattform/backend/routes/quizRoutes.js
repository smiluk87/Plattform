const express = require('express');
const router = express.Router();

const quizQuestions = {
  math: [
    { question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' },
    { question: 'What is 5 * 6?', options: ['30', '25', '35'], answer: '30' },
  ],
  english: [
    { question: 'What is the synonym of "happy"?', options: ['Sad', 'Joyful', 'Angry'], answer: 'Joyful' },
    { question: 'What is the antonym of "hot"?', options: ['Warm', 'Cold', 'Cool'], answer: 'Cold' },
  ],
};

router.get('/:category', (req, res) => {
  const { category } = req.params;
  const questions = quizQuestions[category];

  if (!questions) {
    return res.status(404).json({ message: 'Keine Fragen in dieser Kategorie gefunden.' });
  }

  res.json(questions);
});

module.exports = router;
