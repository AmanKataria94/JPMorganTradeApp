const lastUpdated = (state = null, action) => {
    switch (action.type) {
        case 'SET_UPDATED':
            return action.lastUpdated;
        default:
            return state;
    }
}

export default lastUpdated;