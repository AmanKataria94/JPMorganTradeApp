import placeOrder from '../lastUpdated';

describe('lastUpdated reducer', () => {

    it('should have null default state', () => {
        expect(placeOrder(undefined, {}))
            .toEqual(null);
    })

    it('should handle SET_UPDATED', () => {
        const lastUpdated = new Date();

        expect(placeOrder(null, {
            type: 'SET_UPDATED',
            lastUpdated
        })).toEqual(lastUpdated);
    })
})