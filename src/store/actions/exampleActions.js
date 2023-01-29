const requestExamples = () => ({
    type: "REQUEST_EXAMPLES"
});

const receiveExamples = (examples) => ({
    examples,
    type: "RECEIVE_EXAMPLES"
});

const errorReceiveExamples = () => ({
    type: "ERROR_RECEIVE_EXAMPLES"
});


// HARDCODED VARIANT OF EXAMPLES FOR TESTING WITHOUT BACK END
const getExamples = () => {
    let hardCodedExamples = ['2 + 3', '1 / 0', '54 * 2', '15 - 3', '240 / 20'];

    return new Promise((onSuccess) => {
        setTimeout(
            () => onSuccess(hardCodedExamples),
            2000)
    });
}

const fetchExamples = () => (dispatch) => {
    dispatch(requestExamples());
    return getExamples()
        .then(examples => dispatch(receiveExamples(examples)))
        .catch(() => dispatch(errorReceiveExamples()));
};

// Fetch examples from BackEnd

// const getExamplesFromBE = (count) => {
//     return fetch(`http://localhost:8080/math/examples?count=${count}`, { method: "GET" });
// }

// const fetchExamples = (count) => (async (dispatch) => {
//     dispatch(requestExamples());
//     try {
//         const examplesResponce = await getExamplesFromBE(count);
//         examplesResponce.json().then((json) => dispatch(receiveExamples(json)));
//     } catch {
//         return dispatch(errorReceiveExamples());
//     }
// });

export default fetchExamples;