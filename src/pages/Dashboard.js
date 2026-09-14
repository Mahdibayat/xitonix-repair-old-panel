import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Breadcrumb, Card, Col, Row, Spin, Table } from "antd";
import { SetRoute } from "../scripts/action";
import { CheckPermission, PriceFormat } from "../scripts/helpers";
import { Permissions } from "../scripts/settings";
import API from "../scripts/api";
import Resources from "../scripts/resources";

class DashboardPage extends Component {
  constructor() {
    super();

    this.state = {
      statistics: {},
    };
  }

  componentDidMount() {
    const { onSetRoute, routeName, parentName } = this.props;

    onSetRoute({ openKey: parentName, selectedKey: routeName });

    if (this.props.permissions.view) {
      API.dashboard
        .list()
        .then((result) => {
          this.setState({ loaded: true, statistics: result.data });
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    }
  }

  render() {
    const { loaded, statistics } = this.state;
    const { permissions } = this.props;



    return (
      <Fragment>
        <Breadcrumb>
          <Breadcrumb.Item>{Resources.dashboard}</Breadcrumb.Item>
        </Breadcrumb>
          <Row gutter={16} >
            <Col xs={24} sm={12} md={6}>
              <a href="/reception" >
                <div className="dashborad_cart"   >
                  <span className="dashborad_cart_title" >{Resources.reception}</span>
                </div>
              </a>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <a href="/repair_diagnostic" >
                <div className="dashborad_cart"   >
                  <span className="dashborad_cart_title" >{Resources.during_diagnosis_repairs}</span>
                </div>
              </a>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <a href="/checkout_page" >
                <div className="dashborad_cart"   >
                  <span className="dashborad_cart_title" >{Resources.checkout_page}</span>
                </div>
              </a>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <a href="/wait_confirm" >
                <div className="dashborad_cart"   >
                  <span className="dashborad_cart_title" >{Resources.wait_to_confirm}</span>
                </div>
              </a>
            </Col>
          </Row>

          <Row gutter={16} className="mt-3">
            <Col xs={24} sm={12} md={6}>
              <a href="/be_confirm" >
                <div className="dashborad_cart"   >
                  <span className="dashborad_cart_title" >{Resources.be_confirm}</span>
                </div>
              </a>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <a href="/be_send" >
                <div className="dashborad_cart"   >
                  <span className="dashborad_cart_title" >{Resources.be_send}</span>
                </div>
              </a>
            </Col>
          </Row>
      </Fragment>
    );
  }
}

export default connect(
  (state) => {
    return {
      permissions: {
        view: CheckPermission(state.app.user, Permissions.dashboard_view),
      },
    };
  },
  (dispatch) => {
    return {
      onSetRoute: (data) => dispatch(SetRoute(data)),
    };
  }
)(DashboardPage);
