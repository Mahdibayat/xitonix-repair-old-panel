import React, { Component } from 'react';
import { Button, Layout, Result } from 'antd';
import { Link } from "react-router-dom";
import Resources from '../scripts/resources';

class NotFoundPage extends Component {
    render() {
        return (
            <Layout>
                <Result
                    status="404"
                    title={Resources.notfound}
                    subTitle={Resources.notfound}
                    extra={<Link to="/"><Button type="primary">{Resources.backHome}</Button></Link>}
                />
            </Layout>
        );
    }
}

export default NotFoundPage;