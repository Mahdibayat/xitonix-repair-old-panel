import React from 'react';
import { Layout, Menu } from 'antd';

import Resources from "../scripts/resources";

const { Footer } = Layout;

export default (
    <Menu mode={"horizontal"}  style={{
        display: 'flex',
        background:"#cbc5d7",
        borderRadius: "5px",
        justifyContent: 'space-around'}} theme={"light"}>
        <Menu.Item key={"home"} >
            <a href="/reception" >{Resources.reception}</a>
        </Menu.Item>
        <Menu.Item key={"message"}>
        <a href="/repair_diagnostic" >{Resources.during_diagnosis_repairs}</a>
        </Menu.Item>
        <Menu.Item key={"post"}>
        <a href="/checkout_page" >{Resources.checkout_page}</a>
        </Menu.Item>
        <Menu.Item key={"homepffage"}>
        <a href="/wait_confirm" >{Resources.wait_to_confirm}</a>
        </Menu.Item>
        <Menu.Item key={"fgg"}>
        <a href="/be_confirm" >{Resources.be_confirm}</a>
        </Menu.Item>
        <Menu.Item key={"4rff"}>
        <a href="/be_send" >{Resources.be_send}</a>
        </Menu.Item>
    </Menu>
);
