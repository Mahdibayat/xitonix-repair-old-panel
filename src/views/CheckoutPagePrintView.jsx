import React, { Component } from "react";
import { Modal } from "antd";
import Resources from "../scripts/resources";
import CheckoutPagePrintComponent from "../components/CheckoutPagePrintComponent";

class CheckoutPagePrintView extends Component {
  render() {
    const { data, onClose, visible } = this.props;
    return (
      <Modal
        title={Resources.print}
        visible={visible}
        onCancel={onClose}
        footer={false}
        width={1000}
      >
        <CheckoutPagePrintComponent printDetail={data} />
      </Modal>
    );
  }
}

export default CheckoutPagePrintView;
