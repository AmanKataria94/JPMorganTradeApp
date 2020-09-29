import React from 'react';
import ReactDOM from 'react-dom';
import OrderEntry from '../orderEntry';
import { shallow, mount } from 'enzyme';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { Button } from 'antd';

jest.useFakeTimers();

let wrapper;

const mockStore = configureMockStore();
const store = mockStore({});
const CustomProvider = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

beforeEach(() => {
    wrapper = shallow(
        <OrderEntry store={store} />
    ).dive();

    store.dispatch = jest.fn();
});

describe("app component", () => {
    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('places order on submit clicked', () => {
        wrapper.find(Button).simulate('click');
        expect(wrapper.state('placingOrder')).toBe(true);
    });
});