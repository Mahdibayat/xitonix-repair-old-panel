import React, {useState, useEffect, Fragment, useRef} from 'react';
import { Button, message, Steps, theme, Col, Row, Input, Tooltip } from 'antd';

import {SetConsulting, SetRoute,SetRouteTest} from "../scripts/action";
import { useSelector, useDispatch } from "react-redux";
import {connect} from "react-redux";
import {CheckPermission} from "../scripts/helpers";
import Resources from '../scripts/resources';
import API from "../scripts/api";

const steps = [
  {
    title: 'ثبت و دریافت مرسوله',
    content: 'ثبت و دریافت مرسوله',
  },
  {
    title: 'بررسی مدت زمان تعمیر',
    content: 'بررسی مدت زمان تعمیر',
  },
  {
    title: 'گارانتی و تعمیرات',
    content: 'گارانتی و تعمیرات',
  },
    {
        title: 'بررسی عیب دستگاه',
        content: 'بررسی عیب دستگاه',
    },
    {
        title: 'تعمیر و تامین قطعات',
        content: 'تعمیر و تامین قطعات',
    },
    {
        title: 'تست نهایی',
        content: 'تست نهایی',
    },
    {
        title: 'ارسال مرسوله',
        content: 'ارسال مرسوله',
    },
];
const App = (props) => {

    const dispatch = useDispatch();


    const { routeName, parentName } = props;
    useEffect(  () => {
        dispatch(SetRoute({openKey: parentName, selectedKey: routeName}))

    }, []);
  // const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [deviceId, setDeviceId] = useState(0);
  const [deviceExpertId, setDeviceExpertId] = useState(0);
  const [deviceOwner, setDeviceOwner] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const next = () => {
      console.log(deviceId)
      API.expertDevice
          .check({level: current, type: "next", deviceId: deviceId})
          .then((result) => {
              console.log("nexttt")
              setCurrent(current + 1);
          })
          .catch(() => {
              // this.setState({ submitting: false });
          });

  };
  const prev = () => {
      console.log(deviceId)
      API.expertDevice
          .check({level: current, type: "prev", deviceId: deviceId})
          .then((result) => {
              setCurrent(current - 1);
          })
          .catch(() => {
              // this.setState({ submitting: false });
          });

  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    lineHeight: '260px',
    textAlign: 'center',
    color: "white",
    backgroundColor: "blue",
    borderRadius: "25px",
    border: `1px dashed blue`,
    marginTop: 16,
  };

  const getDeviceInfo = () => {
      API.expertDevice
          .getDeviceInfo({ deviceId: deviceId})
          .then((result) => {
              setDeviceExpertId(result.expertDevice.id)
              setDeviceName(result.device.name)
              setDeviceOwner(result.device.mobile)
              setCurrent(result.current)
          })
          .catch(() => {
              // this.setState({ submitting: false });
          });
  }
  return (
      <>

          <Row style={{marginBottom: "30px", marginTop: "10px"}}>
              <Col xs={24} md={8}>
                  <Tooltip title={Resources.search}>
                      <Input
                          type="text"
                          placeholder={Resources.deviceId}
                          onChange={({ target: { value } }) =>
                              setDeviceId(value)
                          }
                          allowClear
                      />
                  </Tooltip>
              </Col>
              <Col xs={24} md={4}>
                  <Button type="primary" onClick={() => getDeviceInfo()}>
                      {Resources.add}
                  </Button>
              </Col>
          </Row>

          <hr />
          <Row gutter={24}>
              <Col sm={24} md={8}>
                  <span>{Resources.owner}</span>:
                  <span>{deviceOwner}</span>
              </Col>
              <Col sm={24} md={8}>
                  <span>{Resources.name}</span>:
                  <span>{deviceName}</span>
              </Col>
          </Row>
          <hr />

          {deviceExpertId &&
              <div>
                  <Steps current={current} items={items}/>
                  <div style={contentStyle}>{steps[current].content}</div>
                  <div
                      style={{
                          marginTop: 24,
                      }}
                  >
                      {current < steps.length - 1 && (
                          <Button type="primary" onClick={() => next()}>
                              Next
                          </Button>
                      )}
                      {current === steps.length - 1 && (
                          <Button type="primary" onClick={() => message.success('Processing complete!')}>
                              Done
                          </Button>
                      )}
                      {current > 0 && (
                          <Button
                              style={{
                                  margin: '0 8px',
                              }}
                              onClick={() => prev()}
                          >
                              Previous
                          </Button>
                      )}
                  </div>
              </div>

          }
      </>
  );
};
export default connect(
    (state) => {
        return {
            permissions: {
                action: CheckPermission(state.app.user, Permissions.user_option),
                add: CheckPermission(state.app.user, Permissions.user_store)
            }
        };
    },
    // mapDispatchToProps
    ( dispatch) => {

        return {
            // setRoute: SetRoute,
            onSetRoute: (data) => dispatch(SetRoute(data)),
            // setConsulting: data => dispatch(SetConsulting(data))
        };
    }
)
(App);