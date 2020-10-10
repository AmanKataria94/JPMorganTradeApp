import React from 'react';
import ReactDOM from 'react-dom';
import OrderEntry from '../orderEntry';
import { shallow, mount } from 'enzyme';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { Button, Menu, AutoComplete } from 'antd';
import symbols from '../../network/tickerAllowList';

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

    it('changes orderType to market or limit on respective click', () => {
        const orderTypeDropdown = wrapper.find('DropdownButton').first();
        const orderTypeMenu = shallow(<div>{orderTypeDropdown.prop('overlay')}</div>);

        orderTypeMenu.find(Menu.Item).at(1).simulate('click');
        expect(wrapper.state('orderType')).toBe('Limit');

        orderTypeMenu.find(Menu.Item).at(0).simulate('click');
        expect(wrapper.state('orderType')).toBe('Market');
    });

    it('changes tif to correct value on respective click', () => {
        const orderTypeDropdown = wrapper.find('DropdownButton').at(1);
        const orderTypeMenu = shallow(<div>{orderTypeDropdown.prop('overlay')}</div>);

        orderTypeMenu.find(Menu.Item).forEach(item => {
            item.simulate('click');
            expect(wrapper.state('tif')).toBe(item.key());
        });
    });

    it('sets to nearest correct stock on typing', () => {
        const autoComplete = wrapper.find(AutoComplete);
        autoComplete.simulate('blur', { target: { value: 'aap' } });

        expect(wrapper.state('selected')).toBe('AAPL');
    });

    it('remains unchanges if no stock matches', () => {
        const autoComplete = wrapper.find(AutoComplete);
        const stock = wrapper.state('selected');
        autoComplete.simulate('blur', { target: { value: 'non-existent stock' } });

        expect(wrapper.state('selected')).toBe(stock);
    });

    it('filters datasource down to results that contain search characters', () => {
        const autoComplete = wrapper.find(AutoComplete);
        const searchCharacter = 'a';

        autoComplete.simulate('search', searchCharacter);

        expect(wrapper.state('searchDatasource').length).toBeLessThan(symbols.length);
        wrapper.state('searchDatasource').forEach(suggestion => {
            expect(suggestion.toLowerCase().includes(searchCharacter)).toBeTruthy();
        })
    });

    it('updates search field on input', () => {
        const autoComplete = wrapper.find(AutoComplete);
        const search = 'search for stock';

        autoComplete.simulate('change', search);

        expect(wrapper.state('searchField')).toBe(search);
    });

    it('sets selected on user select search item', () => {
        const autoComplete = wrapper.find(AutoComplete);
        const toSelect = 'selected';

        autoComplete.simulate('select', toSelect);

        expect(wrapper.state('selected')).toBe(toSelect);
    })

    it('sets comment on typing into comment box', () => {
        const textArea = wrapper.find('TextArea');
        const comment = 'this is a great trade app';
        textArea.simulate('change', { target: { value: comment } });

        expect(wrapper.state('comment')).toBe(comment);
    })
});