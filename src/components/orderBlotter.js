import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const { Header, Content } = Layout;

class OrderBlotter extends Component {
    constructor(props) {
        super(props);
        this.columnHeaders = [
            { headerName: 'Action', field: 'action' },
            { headerName: 'Symbol', field: 'symbol' },
            { headerName: 'Qty', field: 'quantity' },
            { headerName: 'Order Type', field: 'orderType' },
            { headerName: 'TIF', field: 'tif' },
            { headerName: 'Price', field: 'price' },
            { headerName: 'Stop Price', field: 'stopPrice' },
            { headerName: 'Comment', field: 'comment' }
        ]
    }

    render() {
        const lastUpdated = this.props.lastUpdated ? this.props.lastUpdated.toString() : 'N/A'

        return (
            <div>
                <div style={{ display: "flex" }}>
                    <Header style={{ width: "50%" }}>
                        Order Blotter
                    </Header>
                    <Header style={{ width: "50%" }}>
                        Last Updated: {lastUpdated}
                    </Header>
                </div>
                <div className="ag-theme-balham">
                    <AgGridReact
                        columnDefs={this.columnHeaders}
                        rowData={this.props.orders}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        orders: state.placeOrder,
        lastUpdated: state.lastUpdated
    }
}

export default connect(mapStateToProps)(OrderBlotter);