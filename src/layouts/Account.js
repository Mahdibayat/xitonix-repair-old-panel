import React, { Component } from 'react';
import { Switch } from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Routes from '../scripts/routes';
import Footer from '../components/Footer';

const { Content } = Layout;

class AccountLayout extends Component {
    render() {
        const accountRoutes = Routes.find(p => p.name === 'account').routes;

        return (
            <Layout className="ant-layout-account">
                <Content>
                    <Switch>
                        {accountRoutes.map((item, index) => {
                            if (item.redirect)
                                return (<Redirect key={index} from={item.path} to={item.redirect} exact />)
                            else
                                return (<Route key={index} path={item.path} component={item.component} exact />)
                        })}
                        <Redirect path="*" to="/404" />
                    </Switch>
                </Content>
                {Footer}
            </Layout>
        )
    }
}

export default AccountLayout;