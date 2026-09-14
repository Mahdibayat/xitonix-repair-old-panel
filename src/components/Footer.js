import React from 'react';
import { Layout } from 'antd';

import Resources from "../scripts/resources";

const { Footer } = Layout;

export default (
    <Footer>
        {Resources.copyright}
    </Footer>
);
