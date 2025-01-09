let score = 0;
let currentQuestionIndex = 0;
let questions = [];

const nextButton = document.getElementById("next-btn");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");

nextButton.addEventListener("click", nextQuestion);

// Fetch the questions from the API
function fetchQuestions() {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then(response => response.json())
        .then(data => {
            questions = data.results;
            displayQuestion();
        })
        .catch(error => {
            console.error("Error fetching questions:", error);
        });
}

function displayQuestion() {
    // Make sure there are questions available to display
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;

        const allOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        shuffleArray(allOptions);

        // Clear previous options
        optionsElement.innerHTML = "";

        allOptions.forEach((option, index) => {
            const optionElement = document.createElement("button");
            optionElement.textContent = option;
            optionElement.classList.add("option");
            optionElement.addEventListener("click", () => checkAnswer(option));
            optionsElement.appendChild(optionElement);
        });

        updateProgressBar();
    } else {
        displayFinalScore();
    }
}

function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct_answer;

    if (selectedOption === correctAnswer) {
        score++;
    }

    scoreElement.textContent = score;
    currentQuestionIndex++;
    nextButton.disabled = false;  // Enable the next button after answering a question
}

function nextQuestion() {
    nextButton.disabled = true;  // Disable the next button to prevent multiple clicks
    displayQuestion();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function displayFinalScore() {
    questionElement.textContent = "Quiz Finished!";
    optionsElement.innerHTML = "";
    nextButton.style.display = "none";  // Hide the next button
    scoreElement.textContent = `Your final score: ${score} out of ${questions.length}`;
}

// Start the quiz by fetching questions
fetchQuestions();
