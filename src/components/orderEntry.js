import React, { Component } from 'react';
import { connect } from 'react-redux';
import { placeOrder } from '../actions';
import { Layout, Dropdown, Menu, Row, Col, InputNumber, Button } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import Api from '../network/api';
import axios from 'axios';
import symbols from '../network/tickerAllowList';

const { TextArea } = Input;
const { Header, Content } = Layout;

class OrderEntry extends Component {
    constructor(props) {
        super(props);
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
            comment: ''
        };
        this.api = new Api();
        this.signal = axios.CancelToken.source();
        this.refreshRateMillis = 30000;
    }

    componentDidMount() {
        setInterval(() => { this.loadSelected(this.state.selected); }, this.refreshRateMillis);

    }

    componentWillUnmount() {
        this.signal.cancel('Api is being canceled');
    }

    async loadSelected(selected) {
        try {
            const response = await this.api.get(selected, { cancelToken: this.signal.token });
            console.log(response.data);
            this.setState({ selectedPrice: response.data.c, stopPrice: response.data.c - 10 });
        }
        catch (err) {
            if (axios.isCancel(err)) {
                console.log('Error: ', err.message);
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
        }

        this.props.placeOrder(order)
    }

    getDisabled() {
        return this.state.orderType === this.orderTypes.market;
    }

    render() {
        console.log(this.state);
        return (
            <Layout>
                <Header> EXD Trader Order Entry </Header>
                <Content>
                    <Row>
                        <Col span={6}>
                            Action:
                            <Dropdown.Button overlay={this.actionMenu()}>
                                {this.state.action}
                            </Dropdown.Button>
                        </Col>
                        <Col span={6}>
                            Symbol:
                            <Dropdown.Button overlay={this.symbolMenu()}>
                                {this.state.selected}
                            </Dropdown.Button>
                        </Col>
                        <Col span={6}>
                            Quantity:
                            <InputNumber min={0.01} max={999} step={0.01} defaultValue={100} />
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
                            <TextArea placeholder="<COMMENT>" />
                        </Col>
                        <Col span={6} offset={6}>
                            <Button
                                style={{ width: "50%" }}
                                type="primary"
                                onClick={this.submitOrder.bind(this)}
                            >
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        )
    }

    actionMenu() {
        return (
            <Menu>
                <Menu.Item
                    key="buy"
                    icon={<UserOutlined />}
                    onClick={() => this.setState({ action: this.actions.buy })}
                >
                    Buy
                </Menu.Item>
                <Menu.Item
                    key="sell"
                    icon={<UserOutlined />}
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

    symbolMenu() {
        return (
            <Menu>
                {symbols.map(symbol => {
                    return (
                        <Menu.Item key={symbol} onClick={() => {
                            this.loadSelected(symbol);
                            this.setState({ selected: symbol });
                        }}>
                            {symbol}
                        </Menu.Item>
                    )
                })}
            </Menu>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    placeOrder: order => dispatch(placeOrder(order))
})

export default connect(null, mapDispatchToProps)(OrderEntry);