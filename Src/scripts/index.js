let startQuiz = document.querySelector('#start-quiz');
let quizContainer = document.querySelector('#container')
let button = document.getElementById('start-btn')
let questions = document.getElementById('no-of-questions')
let category = document.getElementById('category')
let difficulty = document.getElementById('difficulty')
let type = document.getElementById('type')
let nextBtn = document.querySelector('.next-question')
let quesitonCounter = document.querySelector('#question-counter');
let totalQuestion = document.querySelector('#total_question')
let returnHomepage = document.querySelector('.return-homepage');
let rightAnswer = document.querySelector('#right-answer')
let wrongAnswer = document.querySelector('#wrong-answer')
let loading = document.querySelector('#loading-container')

let params;

loading.style.display = 'none';
let noOfQuestions;

button.addEventListener('click', () => {

    noOfQuestions = questions.value;
    let selectedCategory = category.options[category.selectedIndex].value;
    let selectedDifficulty = difficulty.options[difficulty.selectedIndex].value;
    let selectedType = type.options[type.selectedIndex].value;

    startQuiz.style.display = 'none';

    if (selectedCategory === 'any' && selectedDifficulty === 'any' && selectedType === 'any') {
        params = `https://opentdb.com/api.php?amount=${noOfQuestions}`

    } else if (selectedCategory !== 'any' && selectedDifficulty !== 'any' && selectedType !== 'any') {
        params = `https://opentdb.com/api.php?amount=${noOfQuestions}&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=${selectedType}`

    }
    else if (selectedCategory === 'any' && selectedDifficulty === 'any' && selectedType !== 'any') {
        params = `https://opentdb.com/api.php?amount=${noOfQuestions}&type=${selectedType}`

    } else if (selectedCategory === 'any' && selectedDifficulty !== 'any' && selectedType !== 'any') {
        params = `https://opentdb.com/api.php?amount=${noOfQuestions}&difficulty=${selectedDifficulty}&type=${selectedType}`

    } else if (selectedDifficulty === 'any' && selectedType === 'any' && selectedCategory !== 'any') {
        params = `https://opentdb.com/api.php?amount=${noOfQuestions}&category=${selectedCategory}`

    } else if (selectedDifficulty === 'any' && selectedType !== 'any' && selectedCategory !== 'any') {
        params = `https://opentdb.com/api.php?amount=${noOfQuestions}&category=${selectedCategory}&type=${selectedType}`

    } else if (selectedCategory === 'any' && selectedType === 'any' && selectedDifficulty !== 'any') {
        params = `https://opentdb.com/api.php?amount=${noOfQuestions}&difficulty=${selectedDifficulty}`

    } else if (selectedType === 'any' && selectedCategory !== 'any' && selectedDifficulty !== 'any') {
        params = `https://opentdb.com/api.php?amount=${noOfQuestions}&category=${selectedCategory}&difficulty=${selectedDifficulty}`

    }

    apiCall();

})

let finishQuiz;

const apiCall = () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
            startQuiz.style.display = 'none';
            loading.style.display = 'flex';
        } else if (xhr.readyState === 4) {
            loading.style.display = 'none';
            quizContainer.style.display = 'initial';
            totalQuestion.textContent = noOfQuestions;
        }
    }
    xhr.open('GET', params, true);

    xhr.onload = () => {
        const questionField = document.getElementById('question');
        const answersFields = document.querySelectorAll('.answer')

        quizData = JSON.parse(xhr.response).results;

        let i = 0;
        let counter = 1;

        questionField.innerHTML = decodeURI(quizData[i].question);

        const displayAnswer = () => {
            let answers = [...quizData[i].incorrect_answers, quizData[i].correct_answer]
            let count = 0;
            let preValue = []
            while (count < answers.length) {
                let num = Math.floor(Math.random() * answers.length);
                if (preValue.indexOf(num) === -1) {
                    preValue.push(num);
                    count++;
                }
            }
            if (answers.length === 2) {
                answersFields[0].innerHTML = answers[preValue[0]]
                answersFields[1].innerHTML = answers[preValue[1]]
                answersFields[2].style.display = 'none';
                answersFields[3].style.display = 'none';
            }
            answersFields[0].innerHTML = answers[preValue[0]]
            answersFields[1].innerHTML = answers[preValue[1]]
            answersFields[2].innerHTML = answers[preValue[2]]
            answersFields[3].innerHTML = answers[preValue[3]]
        }
        displayAnswer();

        let wrong = 0;
        let right = 0;

        let isAnswerWrong = false;

        const answerCheck = () => {
            const onClick = e => {
                if (e.target.textContent === quizData[i].correct_answer) {
                    e.target.style.cssText = 'background-color: rgba(0, 148, 0, .5); border: none; color: white'
                    right++;
                } else {
                    e.target.style.cssText = 'background-color: rgba(255, 0, 0, .5); border: none; color: white';
                    isAnswerWrong = true;
                    wrong++;
                }
                answersFields.forEach(item => {
                    item.removeEventListener('click', onClick);
                });

                if (isAnswerWrong) {
                    document.querySelector('#show_correct_answer').innerHTML = `Correct answer is ${quizData[i].correct_answer}`;
                    isAnswerWrong = false
                }

                if (right + wrong == noOfQuestions) {
                    const show_results = document.querySelector('.show-results')
                    show_results.style.display = 'initial';

                    //---------show the overall test results---------//

                    show_results.addEventListener('click', () => {

                        quizContainer.style.display = 'none';
                        const show_percentage = document.querySelector('#percentage')
                        const passOrNot = document.querySelector('#passOrNot');

                        const percentage = Math.floor((right / noOfQuestions) * 100);
                        show_percentage.textContent = `${percentage}%`;

                        setTimeout(() => {
                            document.querySelector('#result').style.display = 'flex';
                            
                            if (percentage >= 50) {
                                show_percentage.style.color = 'rgba(0, 148, 0, 1)'
                                passOrNot.textContent = 'Congrats! you pass the test';
                                passOrNot.style.color = 'rgba(0, 148, 0, 1)'

                            } else {
                                show_percentage.style.color = 'rgba(255, 0, 0, 1)'
                                passOrNot.textContent = 'Umm, Sorry to say but you are fail!';
                                passOrNot.style.color = 'rgba(255, 0, 0, 1)'
                            }
                            loading.style.display = 'none';
                        }, 2000)
                        loading.style.display = 'flex';
                        document.querySelector('.loading-text').textContent = 'Calculating your results...'
                    })
                }
            };
            answersFields.forEach(item => {
                item.addEventListener('click', onClick);
            });

        }
        answerCheck()
        nextBtn.addEventListener('click', () => {
            i++;
            counter++;
            quesitonCounter.textContent = counter;
            if (i == noOfQuestions - 1) {
                nextBtn.setAttribute('disabled', true);
            }
            questionField.innerHTML = quizData[i].question;
            answersFields.forEach(answerField => {
                answerField.removeAttribute("style");
            })
            displayAnswer();
            answerCheck()

            document.querySelector('#show_correct_answer').textContent = '';
        })
    }

    xhr.send()
}

returnHomepage.addEventListener('click', () => {
    startQuiz.style.display = 'flex';
    quizContainer.style.display = 'none'
    document.querySelector('#result').style.display = 'none';
})



