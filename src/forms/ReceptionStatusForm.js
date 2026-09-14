import React, { Component, Fragment } from "react";
import { Map, TileLayer, Marker, withLeaflet } from "react-leaflet";
import { ReactLeafletSearch } from "react-leaflet-search";
import { cloneDeep } from "lodash";
import { Button, Col, Form, Input, Modal, Row, Select, Checkbox } from "antd";
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


class ReceptionStatusForm extends Component {
  constructor() {
    super();

    this.state = {
      devices:[],
      selected_devices: [],
      users: [],
      products: [],
      items: [], 
      data: [],
      confirm_transfer_to_accepted: false,
      submitting: false
    };

    this.formRef = React.createRef();
    this.mapRef = React.createRef();
  }






  handleSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      this.props.onSubmit(values);
    });
  };

  handleWillUnmount = () => {
    this.formRef.current.resetFields();

  };

  handleDidMount = async (data = {}) => {
    
    const cloneData = cloneDeep(data);
    this.formRef.current.setFieldsValue(cloneData);
    this.setState({
      editMode: !!data.id,
    });

    
  };


  render() {
    const { onCancel, submitting, visible } = this.props;
    const { editMode } = this.state;


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

         
        
                <Row gutter={24}>

                <Col xs={8}>
                    <Form.Item
                        name="status"
                        label={Resources.status}                                        
                    >
                        <Select placeholder={Resources.choose}>
                            <Select.Option >-----</Select.Option>
                            <Select.Option value={0}>{Resources.confirm_transfer_to_accepted}</Select.Option>
                            <Select.Option value={1}>{Resources.transfer_to_repair_stage}</Select.Option>
                            <Select.Option value={2}>{Resources.issuing_diagnosis_card}</Select.Option>
                            <Select.Option value={3}>{Resources.send_to_checkout_page}</Select.Option>
                            <Select.Option value={4}>{Resources.wait_to_confirm}</Select.Option>
                            <Select.Option value={5}>{Resources.be_confirm}</Select.Option>
                            <Select.Option value={6}>{Resources.be_send}</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
     
                </Row>
            </Form>
        </Modal>

      </Fragment>
    );
  }
}

export default ReceptionStatusForm;
