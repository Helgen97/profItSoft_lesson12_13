const initialState = {
    isLoading: false,
    isError: false,
    exampleList: []
};
const exampleReducer = (state = initialState, action) => {
    switch (action.type) {
        case "REQUEST_EXAMPLES": {
            return {
                ...state,
                isLoading: true,
            };
        }
        case "RECEIVE_EXAMPLES": {
            const { examples } = action;
            return {
                ...state,
                isLoading: false,
                isError: false,
                exampleList: examples
            };
        }
        case "ERROR_RECEIVE_EXAMPLES": {
            return {
                ...state,
                isLoading: false,
                isError: true
            };
        }
        default: return state;
    }
}

export default exampleReducer;