import * as actions from '../index';

describe('actions', () => {
    it('should create a place order action', () => {
        const order = 'order';
        const expectedAction = {
            type: 'PLACE_ORDER',
            order
        };
        expect(actions.placeOrder(order)).toEqual(expectedAction);
    })
    it('should create a set updated action', () => {
        const lastUpdated = new Date();
        const expectedAction = {
            type: 'SET_UPDATED',
            lastUpdated
        };
        expect(actions.setUpdated(lastUpdated)).toEqual(expectedAction);
    })
})