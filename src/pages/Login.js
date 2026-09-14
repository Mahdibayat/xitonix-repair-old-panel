import React, { Component, Fragment } from "react";
import { Cookies } from "react-cookie";
import { Button, Form, Input, message } from "antd";
import { NumberOutlined, MobileOutlined } from "@ant-design/icons";
import { Constants } from "../scripts/settings";
import API from "../scripts/api";
import Resources from "../scripts/resources";
import Rules from "../scripts/rules";

class LoginPage extends Component {
  constructor() {
    super();

    this.state = {
      step: 1,
    };

    this.cookies = new Cookies();
  }
  handleLogin = (values) => {
    this.setState({ submitting: true });
    const data = {
      "scope": "*",
      "grant_type": "password",
      "client_id": 2, //local
      // "client_id": "2",///server
      // "client_secret": "kJgv4lp16sfai0BCjG0cO9MJz5Iya8EjK4zRMpKP",  //local
      "client_secret": "L1UdMrW1fwXNFdlYEh1KlydUMKYeL1eHk5s2MQqz", ///server
      "username": `${values.phone}`,
      "password": `${values.password}`
    };
    API.user
      .login(data)
      .then((result) => {
        if (result.access_token) {
          const date = new Date();
          date.setTime(date.getTime() + result.expires_in);
          this.cookies.set("AccessToken", result.access_token, {
            path: "/",
            expires: date,
            domain: window.location.hostname,
          });
          window.location = "/";
        } else {
          this.setState({ submitting: false });
        }
      })
      .catch(() => {
        this.setState({ submitting: false });
      });
  };

  handleVerify = (values) => {
    this.setState({ submitting: true });
    values.phone = this.state.phone

    const data = {
      "scope": "*",
      "grant_type": "password",
      "client_id": 2, //local
      // "client_id": "2",///server
      // "client_secret": "kJgv4lp16sfai0BCjG0cO9MJz5Iya8EjK4zRMpKP",  //local
      "client_secret": "L1UdMrW1fwXNFdlYEh1KlydUMKYeL1eHk5s2MQqz", ///server
      "username": `${values.phone}`,
      "password": `${values.password}`
    };
    API.user
      .verify(data)
      .then((result) => {
        if (result.access_token) {
          const date = new Date();
          date.setTime(date.getTime() + result.expires_in);
          this.cookies.set("AccessToken", result.access_token, {
            path: "/",
            expires: date,
            domain: window.location.hostname,
          });
          window.location = "/";
        } else {
          this.setState({ submitting: false });
        }
      })
      .catch(() => {
        this.setState({ submitting: false });
      });
  };
  render() {
    const { phone, step, submitting } = this.state;

    return (
      <Fragment>
        <img
          src="/images/logo-big.png"
          alt="xitonix"
          width={200}
          height={200}
        />
        <h1>{Resources.repaireManagementPanel}</h1>
        {step === 1 && (
          <Form initialValues={{ phone: phone }}
                onFinish={ this.handleLogin}
          >
            <Form.Item name="phone" rules={Rules.mobile}>
              <Input
                type="text"
                size="large"
                dir="ltr"
                suffix={<MobileOutlined />}
                placeholder={Resources.enterMobile}
              />
            </Form.Item>
            <Form.Item name="password" rules={Rules.required}>
              <Input
                type="text"
                size="large"
                dir="ltr"
                // suffix={<NumberOutlined />}
                // onPressEnter={this.handleVerify}
                placeholder={Resources.password}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={submitting}
                block
              >
                {Resources.login}
              </Button>
            </Form.Item>
          </Form>
        )}
     
      </Fragment>
    );
  }
}

export default LoginPage;
