import 'core-js';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ConfigProvider } from 'antd';
import fa_IR from 'antd/lib/locale-provider/fa_IR';
import Routes from './scripts/routes';
import store from './scripts/store';

import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import 'leaflet/dist/leaflet.css';
import './styles/index.less';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

ReactDOM.render(<ConfigProvider direction="rtl" locale={fa_IR}>
    <Provider store={store}>
        <Router>
            <Switch>
                {Routes.map(item => {
                    return (
                        <Route key={item.name} path={item.path} component={item.component} />
                    )
                })}
            </Switch>
        </Router>
    </Provider>
</ConfigProvider>, document.getElementById('root'));