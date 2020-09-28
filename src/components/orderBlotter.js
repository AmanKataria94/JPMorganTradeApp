import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const { Header, Content } = Layout;

class OrderBlotter extends Component {
    constructor(props) {
        super(props);
        this.columnHeaders = [
            { headerName: 'Action', field: 'action' },
            { headerName: 'Symbol', field: 'symbol' },
            { headerName: 'Qty', field: 'quantity' },
            { headerName: 'OrderTyp', field: 'orderType' },
            { headerName: 'TIF', field: 'tif' },
            { headerName: 'Price', field: 'price' },
            { headerName: 'Stop Price', field: 'stopPrice' },
            { headerName: 'Comment', field: 'comment' }
        ]
    }

    render() {
        return (
            <div>
                <Menu>
                    <Header> Order Blotter </Header>
                </Menu>
                <div class="ag-theme-alpine">
                    <AgGridReact
                        columnDefs={this.columnHeaders}
                        rowData={this.props.orders}
                        style={{ height: "100vh" }}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { orders: state.placeOrder }
}

export default connect(mapStateToProps)(OrderBlotter);