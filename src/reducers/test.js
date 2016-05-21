import { ANSWER } from '../constants/challenges';
import { tail } from '../utils/helpers';

let initialState = null;

const promise = new Promise((resolve, reject) => {
    fetch('http://localhost:3000/db')
        .then((response) => {
            if (response.status === 200) {
                resolve(response.json());

            } else {
                const error = new Error(response.statusText);
                error.code = response.status;
                error.response = response;
                reject(error);
            }
        });
});

promise.then(
    resolve => console.log('json = ', resolve),
    reject => console.log('err = ', reject)
);


    //.catch((err) => console.log('Доступ к базе не получен. Теста не будет.', err));
    console.log('initialState = ', initialState);

//const initialState = {
//    finishedTest: false,
//    userAnswers: [],
//    questions: [
//        {
//            idQuestion: 1,
//            question: '3 + 4 = ?',
//            answers: {
//                '1': 7,
//                '2': 5,
//                '3': 4,
//                '4': 9
//            },
//            idAnswer: 1
//        },
//        {
//            idQuestion: 2,
//            question: '8 - 5 = ?',
//            answers: {
//                '1': 7,
//                '2': 5,
//                '3': 3,
//                '4': 9
//            },
//            idAnswer: 3
//        }
//    ]
//};

export default function questions(state = initialState, action) {
    switch (action.type) {
        case ANSWER:
            const question = action.questionsDB.filter(item => item.idQuestion === action.idQuestion);
            const newAnswers = state.userAnswers;
            question[0].idAnswer === action.idAnswer
                ? newAnswers.push({
                    answer: true
                })
                : newAnswers.push({
                    answer: false,
                    question: question[0].question,
                    userAnswer: question[0].answers[action.idAnswer],
                    trueAnswer: question[0].answers[question[0].idAnswer]
                });
            const newQuestions = state.questions.filter(item => item.idQuestion != action.idQuestion);
            const finishedTest = newQuestions.length < 1 ? true : false;

            return {
                ...state,
                userAnswers: newAnswers,
                questions: newQuestions,
                questionsDB: action.questionsDB,
                finishedTest: finishedTest
            };
        default:
            return state;
    }

}