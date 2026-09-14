import React, { Component, Fragment } from "react";
import { Map, TileLayer, Marker, withLeaflet } from "react-leaflet";
import { ReactLeafletSearch } from "react-leaflet-search";
import { cloneDeep } from "lodash";
import { Button, Col, Form, Input, Modal, Row, Select, Checkbox, InputNumber } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  MinusOutlined,
  MobileOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import DatePicker from "react-modern-calendar-datepicker";
import moment from "moment-jalaali";
import { Constants } from "../scripts/settings";
import Resources from "../scripts/resources";
import Rules from "../scripts/rules";
import API from "../scripts/api";
import { PriceFormat, SearchFormat } from "../scripts/helpers";

const ReactLeafletSearchComponent = withLeaflet(ReactLeafletSearch);


class DevicePartForm extends Component {
  constructor() {
    super();

    this.state = {    
      items: [], 
      data: [],
      submitting: false
    };

    this.formRef = React.createRef();
    this.mapRef = React.createRef();
  }

  showMap = (address) => {
    this.setState({ visibleMap: true, selectedAddress: address });

    setTimeout(() => {
      this.mapRef.current.handleDidMount(address);
    }, 0);
  };

  hideMap = () => {
    this.setState({ visibleMap: false });
  };

  handleChangeDate = (date, obj) => {
    const state = {};
    state[obj] = date;
    this.formRef.current.setFieldsValue(state);
  };



  handleSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      this.props.onSubmit(values);
    });
  };

  handleWillUnmount = () => {
    this.formRef.current.resetFields();

  };

  handleDidMount = async (data = {}) => {
    
    if(data.id){
        const cloneData = cloneDeep(data);
        this.formRef.current.setFieldsValue(cloneData);
    }
    this.setState({
      editMode: !!data.id,
    });


    
  };



  render() {
    const { onCancel, submitting, visible } = this.props;
    const { editMode, devices, selected_devices, users, items, products,
        confirm_transfer_to_accepted, transfer_to_repair_stage, send_sms_to_customer
     } = this.state;


    return (
      <Fragment>
        <Modal
          title={editMode ? Resources.edit : Resources.add}
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={onCancel}
          okText={Resources.confirm}
          cancelText={Resources.cancel}
          okButtonProps={{ loading: submitting }}
          cancelButtonProps={{ disabled: submitting }}
          className="modal-users"
          width={1000}
        >
           <Form ref={this.formRef} layout="vertical" >

            <Row gutter={24} >
                <Col xs={8}>
                    <Form.Item label={Resources.name} name="name" >
                        <Input ></Input>
                    </Form.Item>
                </Col>

                <Col xs={8}>
                    <Form.Item style={{width: "100%"}} label={`${Resources.price} (${Resources.toman})`} name="price" >
                        <Input type='number' ></Input>
                    </Form.Item>
                </Col>
            </Row>

           </Form>
        </Modal>

      </Fragment>
    );
  }
}

export default DevicePartForm;
