import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Cookies } from "react-cookie";
import { Switch } from "react-router";
import { Redirect, Route, Link } from "react-router-dom";
import { Drawer, Dropdown, Layout, Menu, notification, Spin } from "antd";
import { LogoutOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { OpenMenu, UpdateUser } from "../scripts/action";
import { CheckPermission } from "../scripts/helpers";
import API from "../scripts/api";
import Resources from "../scripts/resources";
import Routes from "../scripts/routes";
import Footer from "../components/Footer";
import "react-toastify/dist/ReactToastify.css";
// import messaging from "../firebase";

const { Header, Content, Sider } = Layout;

const CustomRoute = ({
  component: Component,
  routeName,
  parentName,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (
      <Component {...props} routeName={routeName} parentName={parentName} />
    )}
  />
);

class BasicLayout extends Component {
  constructor() {
    super();

    this.state = {
      loaded: false,
      user: {},
      visible: false,
      isTokenFound: false,
    };

    this.cookies = new Cookies();
  }

  showDrawer = () => {
    this.setState({ visible: true });
  };

  hideDrawer = () => {
    this.setState({ visible: false });
  };

  handleLogout = () => {

    API.user.logout().then((result) => {
      // this.cookies.remove("AccessToken", {
      //   path: "/",
      //   domain: window.location.hostname,
      // });
      window.location = "/";
    });

   
  };

  handleMenu = (key) => {
    const { onOpenMenu, openKey } = this.props;
    onOpenMenu(openKey === key ? "" : key);
  };

  componentDidMount() {
    const accessToken = this.cookies.get("AccessToken");

    if (accessToken) {
      API.user.me().then((result) => {
        this.props.onUpdateUser(result);
        this.setState({ loaded: true });
      });
    } else {
      window.location = "/account/login";
    }
    // this.handleToken();
  }
  // handleToken = async () => {
  //   try {
  //     const token = await messaging.getToken({
  //       vapidKey:
  //         "BCSh81GyumoQ34oA_xv9ZKxqPjr1djUlOP_hEFZS2d2s7EVCWlZbmpZSMYnUoQXjrYBq-XZO5scSueYbDVebKds",
  //     });
  //     console.log(token);
  //     localStorage["fcmToken"] = token;
  //     messaging.onMessage((payload) => {
  //       notification.info({
  //         message: payload.notification.title,
  //         description: payload.notification.body,
  //       });
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  render() {
    const { loaded, visible } = this.state;
    const { browser, openKey, selectedKey, user } = this.props;
    const appRoutes = Routes.find((p) => p.name === "app").routes;

    const menu = (
      <Fragment>
        <div className="sidebar-logo">
          <img
            src="/images/logo.png"
            alt="mizbano"
            height="50px"
            width="75px"
          />
        </div>
        <Menu mode="inline" selectedKeys={[selectedKey]} openKeys={[openKey]}>
          {appRoutes
            .filter(
              (o) =>
                !o.hidden &&
                (!o.authority || CheckPermission(user, o.authority))
            )
            .map((route) => {
              if (route.childs) {
                const childs = route.childs.filter(
                  (p) =>
                    !p.hidden &&
                    (!p.authority || CheckPermission(user, p.authority))
                );

                if (childs.length) {
                  return (
                    <Menu.SubMenu
                      key={route.name}
                      title={
                        <span>
                          {route.icon} <span> {route.title} </span>
                        </span>
                      }
                      onTitleClick={() => this.handleMenu(route.name)}
                    >
                      {childs.map((child) => {
                        return (
                          <Menu.Item key={child.name} onClick={this.hideDrawer}>
                            <Link to={child.path}>
                              {child.icon} <span> {child.title} </span>
                            </Link>
                          </Menu.Item>
                        );
                      })}
                    </Menu.SubMenu>
                  );
                } else {
                  return null;
                }
              } else {
                return (
                  <Menu.Item key={route.name} onClick={this.hideDrawer}>
                    <Link to={route.path}>
                      {route.icon} <span> {route.title} </span>
                    </Link>
                  </Menu.Item>
                );
              }
            })}
        </Menu>
      </Fragment>
    );

    const headerMenu = (
      <Menu>
        <Menu.Item>
          <span onClick={this.handleLogout}>
            <LogoutOutlined /> {Resources.logout}
          </span>
        </Menu.Item>
      </Menu>
    );

    if (loaded) {
      return (
        <Layout>
          {/* <MessageRecive /> */}
          {browser.greaterThan.large && <Sider width={200}> {menu} </Sider>}
          <Layout>
            <Header>
              {browser.lessThan.infinity && (
                <MenuFoldOutlined
                  className="trigger"
                  onClick={this.showDrawer}
                />
              )}
              <Dropdown overlay={headerMenu}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="logout"
                >
                  {user.firstName ? `${user.firstName} ${user.lastName}` : user.lastName}
                </a>
              </Dropdown>
            </Header>
            <Content>
              <Switch>
                {appRoutes
                  .filter(
                    (o) => !o.authority || CheckPermission(user, o.authority)
                  )
                  .map((route) => {
                    if (route.redirect) {
                      return (
                        <Redirect
                          key={route.name}
                          from={route.path}
                          to={route.redirect}
                          exact
                        />
                      );
                    } else if (route.childs) {
                      return route.childs
                        .filter(
                          (p) =>
                            !p.authority || CheckPermission(user, p.authority)
                        )
                        .map((child) => (
                          <CustomRoute
                            key={child.name}
                            path={child.path}
                            component={child.component}
                            routeName={child.name}
                            parentName={route.name}
                            exact
                          />
                        ));
                    } else {
                      return (
                        <CustomRoute
                          key={route.name}
                          path={route.path}
                          component={route.component}
                          routeName={route.name}
                          parentName={route.name}
                          exact
                        />
                      );
                    }
                  })}
                <Redirect path="*" to="/404" />
              </Switch>
            </Content>
            {Footer}
            {browser.lessThan.infinity && (
              <Drawer
                visible={visible}
                closable={false}
                onClose={this.hideDrawer}
                placement="right"
                width="200"
                className="drawer-basic-layout"
              >
                {menu}
              </Drawer>
            )}
          </Layout>
        </Layout>
      );
    } else {
      return <Spin className="ant-spin-center" />;
    }
  }
}

export default connect(
  (state) => {
    return {
      browser: state.browser,
      openKey: state.app.openKey,
      selectedKey: state.app.selectedKey,
      user: state.app.user,
    };
  },
  (dispatch) => {
    return {
      onOpenMenu: (data) => dispatch(OpenMenu(data)),
      onUpdateUser: (data) => dispatch(UpdateUser(data)),
    };
  }
)(BasicLayout);
