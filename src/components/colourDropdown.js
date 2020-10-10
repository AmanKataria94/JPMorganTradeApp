import React, { Component } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import { render } from 'enzyme';

export default class ColourDropdown extends Component {

    render() {
        const style = {
            backgroundColor: this.props.bgColour,
            color: this.props.textColour
        }
        const icon = <EllipsisOutlined />;

        return (
            <div style={{ display: "flex" }}>
                <Button style={style}>{this.props.text}</Button>
                <Dropdown overlay={this.props.overlay}>
                    <Button icon={icon} />
                </Dropdown>
            </div>
        )
    }
}