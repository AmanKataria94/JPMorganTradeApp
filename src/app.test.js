import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { shallow, mount } from 'enzyme';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { Button } from 'antd';

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
    wrapper = mount(
        <CustomProvider store={store}>
            <App />
        </CustomProvider>
    );
});

describe("app component", () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>
            , div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });
});