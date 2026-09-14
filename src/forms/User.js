import React, { Component, Fragment } from "react";
import { Map, TileLayer, Marker, withLeaflet } from "react-leaflet";
import { ReactLeafletSearch } from "react-leaflet-search";
import { cloneDeep } from "lodash";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  MinusOutlined,
  MobileOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import DatePicker from "react-modern-calendar-datepicker";
import moment from "moment-jalaali";
import { Constants } from "../scripts/settings";
import Resources from "../scripts/resources";
import Rules from "../scripts/rules";

const ReactLeafletSearchComponent = withLeaflet(ReactLeafletSearch);


class UserForm extends Component {
  constructor() {
    super();

    this.state = {
      title: "",
      addresses: [{ id: 0 }],
      phones: [],
      selectedAddress: 0,
      visibleMap: false,
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
      const { addresses, phones } = this.state;
      const { birthDate } = values;
      const data = {
        phone: values.phone,
        firstName: values.firstName,
        lastName: values.lastName,
        user_type: values.user_type,
      };

      if (birthDate)
        data.birthDate = moment(
          `${birthDate.year}-${birthDate.month}-${birthDate.day}`,
          Constants.jDateFormat
        ).format(Constants.dateFormat);




      this.props.onSubmit(data);
    });
  };

  handleWillUnmount = () => {
    this.formRef.current.resetFields();

  };

  handleDidMount = (data = {}) => {
    const cloneData = cloneDeep(data);

    if (cloneData.birthDate) {
      const birthDate = moment(cloneData.birthDate);

      cloneData.birthDate = {
        day: birthDate.jDate(),
        month: birthDate.jMonth() + 1,
        year: birthDate.jYear(),
      };
    }

    this.formRef.current.setFieldsValue(cloneData);
    this.setState({
      editMode: !!cloneData.id,
    });
  };

  render() {
    const { onCancel, submitting, visible } = this.props;
    const { addresses, editMode, phones, visibleMap } = this.state;

    const DatePickerInput = ({ ref }, name) => {
      const date = this.formRef.current
        ? this.formRef.current.getFieldValue(name)
        : null;
      return (
        <Input
          value={date ? `${date.year}-${date.month}-${date.day}` : date}
          prefix={<CalendarOutlined />}
          placeholder={Resources.choose}
          ref={ref}
          readOnly
        />
      );
    };

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
          width={700}
        >
          <Form ref={this.formRef} layout="vertical">
            <Row gutter={24}>
              <Col xs={24} md={phones.length ? 12 : 24}>
                <Row gutter={6}>
                  <Col xs={20}>
                    <Form.Item
                      name="phone"
                      label={Resources.mobile}
                      rules={Rules.required}
                    >
                      <Input
                        type="text"
                        dir="ltr"
                        prefix={<MobileOutlined />}
                        placeholder={Resources.mobileHint}
                      />
                    </Form.Item>
                  </Col>

                </Row>
              </Col>

            </Row>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item name="firstName" label={Resources.firstName}>
                  <Input
                    type="text"
                    prefix={<UserOutlined />}
                    placeholder={Resources.nameHint}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="lastName"
                  label={Resources.lastName}
                  rules={Rules.required}
                >
                  <Input
                    type="text"
                    prefix={<UserOutlined />}
                    placeholder={Resources.nameHint}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="birthDate" label={Resources.birthdate}>
                  <DatePicker
                    locale="fa"
                    onChange={(value) =>
                      this.handleChangeDate(value, "birthDate")
                    }
                    renderInput={(ref) => DatePickerInput(ref, "birthDate")}
                    shouldHighlightWeekends
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item
                    name="user_type"
                    label={Resources.type}
                    rules={Rules.required}
                >
                  <Select placeholder={Resources.choose}>
                    <Select.Option value="guest">{Resources.guest}</Select.Option>
                    <Select.Option value="villa_owner">{Resources.villaOwner}</Select.Option>
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

export default UserForm;
