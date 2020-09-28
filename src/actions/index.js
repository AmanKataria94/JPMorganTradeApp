import lastUpdated from "../reducers/lastUpdated";

export const placeOrder = order => ({
    type: 'PLACE_ORDER',
    order
});

export const setUpdated = lastUpdated => ({
    type: 'SET_UPDATED',
    lastUpdated
})