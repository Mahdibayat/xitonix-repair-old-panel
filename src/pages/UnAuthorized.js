import React, { Component } from 'react';
import { Button, Layout, Result } from 'antd';
import { Link } from "react-router-dom";
import Resources from '../scripts/resources';

class UnAuthorizedPage extends Component {
    render() {
        return (
            <Layout>
                <Result
                    status="403"
                    title={Resources.unauthorized}
                    subTitle={Resources.unauthorized}
                    extra={<Link to="/"><Button type="primary">{Resources.backHome}</Button></Link>}
                />
            </Layout>
        );
    }
}

export default UnAuthorizedPage;