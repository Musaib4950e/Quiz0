let score = 0;
let currentQuestionIndex = 0;
let questions = [];

const nextButton = document.getElementById("next-btn");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");

// Wait until the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Fetch the questions after page load
    fetchQuestions();
});

// Fetch the questions from the API
function fetchQuestions() {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        .then(response => response.json())
        .then(data => {
            // Check the API response and log it for debugging
            console.log("Fetched Questions:", data.results);
            questions = data.results;

            // Start the quiz
            displayQuestion();
        })
        .catch(error => {
            console.error("Error fetching questions:", error);
            alert("Failed to load quiz questions.");
        });
}

// Display the current question
function displayQuestion() {
    if (questions.length === 0) {
        console.log("No questions available!");
        return;
    }

    // Check if we've reached the end of the questions
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;

        // Get all options and shuffle them
        const allOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        shuffleArray(allOptions);

        // Clear previous options
        optionsElement.innerHTML = "";

        // Add options as buttons
        allOptions.forEach(option => {
            const optionElement = document.createElement("button");
            optionElement.textContent = option;
            optionElement.classList.add("option");
            optionElement.addEventListener("click", () => checkAnswer(option));
            optionsElement.appendChild(optionElement);
        });

        // Update the progress bar
        updateProgressBar();
    } else {
        // Show final score if no questions are left
        displayFinalScore();
    }
}

// Check if the selected answer is correct
function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct_answer;

    if (selectedOption === correctAnswer) {
        score++;
    }

    // Update score display
    scoreElement.textContent = `Score: ${score}`;
    currentQuestionIndex++;

    // Disable next button to prevent multiple clicks
    nextButton.disabled = false;

    // Move to the next question
    nextButton.addEventListener("click", () => {
        nextButton.disabled = true;  // Disable the button until next question
        displayQuestion();
    });
}

// Shuffle the options randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
}

// Update the progress bar
function updateProgressBar() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Display the final score when the quiz is finished
function displayFinalScore() {
    questionElement.textContent = "Quiz Finished!";
    optionsElement.innerHTML = "";
    nextButton.style.display = "none";  // Hide the next button after the last question
    scoreElement.textContent = `Your final score: ${score} out of ${questions.length}`;
}
