import React, { Component } from 'react';
import { Layout, Divider, Dropdown, Menu } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import OrderEntry from './components/orderEntry';
import OrderBlotter from './components/orderBlotter';

const { Header, Content } = Layout;

export default class App extends Component {
    render() {
        return (
            <Layout>
                <OrderEntry />
                <Divider />
                <OrderBlotter />
            </Layout>
        )
    }
}