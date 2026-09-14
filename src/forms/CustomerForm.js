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


class CustomerForm extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      cities: [],
      items: [], 
      data: [],
      submitting: false
    };

    this.formRef = React.createRef();
    this.mapRef = React.createRef();
  }



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
    const cloneData = cloneDeep(data);
    this.formRef.current.setFieldsValue(cloneData);
    await this.getSearchCities()
    this.setState({
      editMode: !!data.id,
    });

    
  };


 getSearchCities = (params = {}) => {
        this.setState({ loading: true });
        API.city.list(params)

            .then((result) => {
                if (result.data) {
                    this.setState({
                        loading: false,
                        cities: result.data,
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    };
  render() {
    const { onCancel, submitting, visible } = this.props;
    const { editMode, cities } = this.state;


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
                
                <Col xs={24} sm={12} md={6}>
                    <Form.Item name="city_id" label={Resources.city}  >
                        <Select showSearch
                            filterOption={(input, option) => {
                            return (
                                option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            );
                            }}
                            allowClear={true}>
                            {cities.map(item => (
                                <Select.Option key={item.id} title={item.name}  value={item.id}>{item.name}</Select.Option>                                        ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                    <Form.Item name="full_name"   label={Resources.name}>
                        <Input type="text"   />
                    </Form.Item>
                </Col>
                
                <Col xs={24} md={6}>
                    <Form.Item name="phone"   label={Resources.phone}>
                        <Input type="number"   />
                    </Form.Item>
                </Col>
                
                <Col xs={24} md={6}>
                    <Form.Item name="address"   label={Resources.address}>
                        <Input type="text"   />
                    </Form.Item>
                </Col>
            </Row> 
                    
            </Form>
        </Modal>

      </Fragment>
    );
  }
}


export default CustomerForm;

