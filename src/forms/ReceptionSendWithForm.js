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


class ReceptionSendWithForm extends Component {
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
          title={Resources.sendWith}
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
                        name="send_type"
                        label={Resources.sendWith}                                        
                    >
                        <Select placeholder={Resources.choose}>
                            <Select.Option >-----</Select.Option>
                            <Select.Option value="post">{Resources.post}</Select.Option>
                            <Select.Option value="tipax">{Resources.tipax}</Select.Option>
                            <Select.Option value="bus">{Resources.bus}</Select.Option>
                            <Select.Option value="freight">{Resources.freight}</Select.Option>
                        
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

export default ReceptionSendWithForm;
