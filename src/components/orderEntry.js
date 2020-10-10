import React, { Component } from 'react';
import { connect } from 'react-redux';
import { placeOrder, setUpdated } from '../actions';
import { AutoComplete, Layout, Dropdown, Menu, Row, Col, InputNumber, Button, Spin } from 'antd';
import { Input } from 'antd';
import ColourDropdown from './colourDropdown';
import Api from '../network/api';
import axios from 'axios';
import symbols from '../network/tickerAllowList';

const { TextArea } = Input;
const { Header, Content } = Layout;

class OrderEntry extends Component {
    constructor() {
        super();
        this.actions = {
            buy: 'Buy',
            sell: 'Sell'
        };
        this.orderTypes = {
            market: 'Market',
            limit: 'Limit'
        }
        this.tifs = {
            gtc: 'GTC',
            day: 'DAY',
            fok: 'FOK',
            ioc: 'IOC'
        }

        this.state = {
            selected: symbols[0],
            action: this.actions.buy,
            orderType: this.orderTypes.market,
            quantity: 100,
            tif: this.tifs.day,
            selectedPrice: -1,
            stopPrice: -1,
            comment: '',
            placingOrder: false,
            searchField: symbols[0],
            searchDatasource: []
        };

        this.api = new Api();
        this.signal = axios.CancelToken.source();
        this.refreshRateMillis = 30000;
        this.submitOrder = this.submitOrder.bind(this);
        this.onSearchInput = this.onSearchInput.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.setNearestSearchResult = this.setNearestSearchResult.bind(this);
        this.searchSelected = this.searchSelected.bind(this);
    }

    componentDidMount() {
        this.loadSelected(this.state.selected);
        setInterval(() => { this.loadSelected(this.state.selected); }, this.refreshRateMillis);
    }

    componentWillUnmount() {
        this.signal.cancel('Api is being canceled');
    }

    async loadSelected(selected) {
        try {
            const response = await this.api.get(selected, { cancelToken: this.signal.token });
            this.setState({ selectedPrice: response.data.c, stopPrice: response.data.c - 10, isLoaded: true });
        }
        catch (err) {
            if (axios.isCancel(err)) {
                console.log(err);
            }
        }
    }

    submitOrder() {
        const order = {
            action: this.state.action,
            symbol: this.state.selected,
            quantity: this.state.quantity,
            orderType: this.state.orderType,
            price: this.state.selectedPrice,
            tif: this.state.tif,
            stopPrice: this.state.stopPrice,
            comment: this.state.comment
        };

        this.setState({ placingOrder: true });

        setTimeout(() => {
            this.props.placeOrder(order);
            this.props.setUpdated(new Date());
            this.setState({ placingOrder: false });
        }, 2000)
    }

    getDisabled() {
        return this.state.orderType === this.orderTypes.market;
    }

    getActionButtonColour() {
        return this.state.action === this.actions.buy ? 'green' : 'red';
    }

    onSearch(searchtext) {
        const validFields = symbols.filter(symbol => symbol.toLowerCase().includes(searchtext.toLowerCase()));
        this.setState({ searchDatasource: validFields });
    }

    onSearchInput(input) {
        this.setState({ searchField: input });
    }

    setNearestSearchResult(event) {
        const searchtext = event.target.value;
        const validFields = symbols.filter(symbol => symbol.toLowerCase().includes(searchtext.toLowerCase()));
        if (validFields.length > 0) {
            this.setState({ searchField: validFields[0], selected: validFields[0] });
        }
        else {
            this.setState({ searchField: this.state.selected });
        }
        this.loadSelected(this.state.selected);
    }

    searchSelected(selected) {
        this.setState({ selected });
        this.loadSelected(selected);
    }

    render() {
        return (
            <Layout>
                <Header> EXD Trader Order Entry </Header>
                <Content>
                    <Row>
                        <Col span={6}>
                            Action:
                            <ColourDropdown
                                text={this.state.action}
                                bgColour={this.getActionButtonColour()}
                                textColour={'white'}
                                overlay={this.actionMenu()}
                            />
                        </Col>
                        <Col span={6}>
                            Symbol:
                            <AutoComplete
                                value={this.state.searchField}
                                dataSource={this.state.searchDatasource}
                                onSearch={this.onSearch}
                                onChange={this.onSearchInput}
                                onBlur={this.setNearestSearchResult}
                                onSelect={this.searchSelected}
                            />
                        </Col>
                        <Col span={6}>
                            Quantity:
                            <InputNumber
                                min={0.01}
                                max={999}
                                step={0.01}
                                defaultValue={100}
                                onChange={(quantity) => this.setState({ quantity })}
                            />
                        </Col>
                        <Col span={6}>
                            Price:
                            <InputNumber
                                min={0.01}
                                max={999}
                                step={0.01}
                                value={this.state.selectedPrice}
                                onChange={value => this.setState({ selectedPrice: value })}
                                disabled={this.getDisabled()}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            OrderType:
                            <Dropdown.Button overlay={this.orderTypeMenu()}>
                                {this.state.orderType}
                            </Dropdown.Button>
                        </Col>
                        <Col span={6}>
                            TIF:
                            <Dropdown.Button overlay={this.tifMenu()}>
                                {this.state.tif}
                            </Dropdown.Button>
                        </Col>
                        <Col span={6} offset={6}>
                            Stop Price:
                            <InputNumber
                                min={0.01}
                                max={999}
                                step={0.01}
                                value={this.state.stopPrice}
                                onChange={value => this.setState({ stopPrice: value })}
                                disabled={this.getDisabled()}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <TextArea placeholder="<COMMENT>" onChange={(event) => {
                                this.setState({ comment: event.target.value })
                            }
                            } />
                        </Col>
                        <Col span={6} offset={6}>
                            <Button
                                style={{ width: "50%" }}
                                type="primary"
                                onClick={this.submitOrder}
                            >
                                Submit
                            </Button>
                        </Col>
                    </Row>
                    {this.spin()}
                </Content>
            </Layout>
        )
    }

    spin() {
        return this.state.placingOrder ? (
            <Spin tip="placing order..." />
        )
            : null
    }

    actionMenu() {
        return (
            <Menu>
                <Menu.Item style={{ backgroundColor: "green" }}
                    key="buy"
                    onClick={() => this.setState({ action: this.actions.buy })}
                >
                    Buy
                </Menu.Item>
                <Menu.Item
                    style={{ backgroundColor: "red" }}
                    key="sell"
                    onClick={() => this.setState({ action: this.actions.sell })}
                >
                    Sell
                </Menu.Item>
            </Menu>
        )
    }

    orderTypeMenu() {
        return (
            <Menu>
                <Menu.Item key="market" onClick={() => { this.setState({ orderType: this.orderTypes.market }) }}>
                    Market
                </Menu.Item>
                <Menu.Item key="limit" onClick={() => { this.setState({ orderType: this.orderTypes.limit }) }}>
                    Limit
                </Menu.Item>
            </Menu>
        )
    }

    tifMenu() {
        return (
            <Menu>
                {Object.values(this.tifs).map(tif => {
                    return (
                        <Menu.Item key={tif} onClick={() => { this.setState({ tif }) }}>
                            {tif}
                        </Menu.Item>
                    )
                })}
            </Menu>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    placeOrder: order => dispatch(placeOrder(order)),
    setUpdated: lastUpdated => dispatch(setUpdated(lastUpdated))
})

export default connect(null, mapDispatchToProps)(OrderEntry);