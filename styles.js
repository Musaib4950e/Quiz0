let score = 0;
let currentQuestionIndex = 0;
let questions = [];

const nextButton = document.getElementById("next-btn");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");

// Add event listener to 'Next Question' button
nextButton.addEventListener("click", nextQuestion);

// Fetch the questions from the API
function fetchQuestions() {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then(response => response.json())
        .then(data => {
            // Log data to ensure we are getting the correct response from the API
            console.log("Fetched Questions:", data.results);
            questions = data.results;
            displayQuestion();
        })
        .catch(error => {
            console.error("Error fetching questions:", error);
        });
}

// Display current question
function displayQuestion() {
    if (questions.length === 0) {
        console.log("No questions available!");
        return;
    }

    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;

        // Get all options and shuffle them
        const allOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        shuffleArray(allOptions);

        optionsElement.innerHTML = ""; // Clear previous options

        allOptions.forEach(option => {
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

// Check if selected option is correct
function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct_answer;

    if (selectedOption === correctAnswer) {
        score++;
    }

    scoreElement.textContent = score;
    currentQuestionIndex++;
    nextButton.disabled = false; // Enable the next button after answering
}

// Go to the next question
function nextQuestion() {
    nextButton.disabled = true; // Disable the button to avoid multiple clicks
    displayQuestion();
}

// Shuffle the options array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Update the progress bar based on current question index
function updateProgressBar() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Display final score
function displayFinalScore() {
    questionElement.textContent = "Quiz Finished!";
    optionsElement.innerHTML = "";
    nextButton.style.display = "none"; // Hide next button
    scoreElement.textContent = `Your final score: ${score} out of ${questions.length}`;
}

// Start fetching questions when the page loads
fetchQuestions();
