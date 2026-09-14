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


class ReceptionForm_old extends Component {
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
        await this.getReception(data.id)
    }
    this.setState({
      editMode: !!data.id,
    });

    
  };
  getReception = async(id) => {

    await API.reception.show(id).then((result) => {
      const cloneData = cloneDeep(result.data);
      this.formRef.current.setFieldsValue(cloneData);
      if(result.data.confirm_transfer_to_accepted){
        this.setState({confirm_transfer_to_accepted: "checked"})
      }
      if(result.data.transfer_to_repair_stage){
        this.setState({transfer_to_repair_stage: "checked"})
      }
      if(result.data.send_sms_to_customer){
        this.setState({send_sms_to_customer: "checked"})
      }
      this.setState({ user_type: result.data.user_type})

    });

    
}

  handleSearchUsers = (value) => {

    if (value) {
      // this.handleSearchTimeOut(value)
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        //search function
        API.representative.list(this.state.user_type, {q: SearchFormat(value)}).then((result) => {
            console.log(result )
          if (result.data && result.data.length) {
            console.log("into handleSearchUsers is done" )

            const users = result.data.map(o => {
              return {
                id: o.id,
                full_name: o.full_name,
                phone: o.phone,
                value: value,
                count: 1
              }
            });

            this.setState({users: users});
          } else {
            this.setState({users: []});
          }
        });

      }, 300);
    }
}

handleSearchDevices = (value) => {
    if (value) {
      // this.handleSearchTimeOut(value)
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        //search function
        API.device.list({q: SearchFormat(value)}).then((result) => {
          if (result.data && result.data.length) {
            const devices = result.data.map(o => {
              return {
                id: o.ID,
                IMEI: o.IMEI,
                Name: o.Name,
                value: value,
                count: 1
              }
            });

            this.setState({devices: devices});
          } else {
            this.setState({devices: []});
          }
        });

      }, 300);
    }
}

handleSearchProducts = (value) => {
    if (value) {
      // this.handleSearchTimeOut(value)
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        //search function
        API.product.list({q: SearchFormat(value), type: "product"}).then((result) => {
          if (result.data && result.data.length) {
            const products = result.data.map(o => {
              return {
                id: o.id,
                name: o.name,
                value: value,
                count: 1
              }
            });

            this.setState({products: products});
          } else {
            this.setState({products: []});
          }
        });

      }, 300);
    }
}
handleSearchItems = (value) => {
    if (value) {
      // this.handleSearchTimeOut(value)
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        //search function
        API.product.list({q: SearchFormat(value), type: "accessory"}).then((result) => {
          if (result.data && result.data.length) {
            const items = result.data.map(o => {
              return {
                id: o.id,
                name: o.name,
                value: value,
                count: 1
              }
            });

            this.setState({items: items});
          } else {
            this.setState({items: []});
          }
        });

      }, 300);
    }
}

handleFilterSearchApi = (input, option) => {
    const value = SearchFormat(input);
    const split = value.split(' ');
    let valid = option.code.indexOf(value) >= 0;

    split.forEach(val => {
      valid = valid || option.code.indexOf(val) >= 0;
    });

    return valid;
}


handleSelectDevice = (value, options, key) => {
    const {selected_devices} = this.state
    API.device.show(value).then((result) => {
        selected_devices.push({key: key, data:  result.data})
        this.setState({selected_device: selected_devices});
        const devices = this.formRef.current.getFieldValue('devices');
        devices[key] = { ...devices[key], ["otp"]: result.data.OTP};
        this.formRef.current.setFieldValue('devices', devices);
        devices[key] = { ...devices[key], ["serial"]: result.data.serial };
        this.formRef.current.setFieldValue('devices', devices);
    })
}


changeUserType = (value) => {
    this.setState({ user_type: value })
};

onChangeChecbox = (value, itemName) => {
  console.log(value.target.checked, itemName)
  // this.setState({itemName: value.target.checked})
  this.formRef.current.setFieldsValue({[itemName]: value.target.checked})
}
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

            <div className='set_middle_content'><span>{Resources.userInfo}</span></div>
            <Row gutter={24} >
                <Col xs={24} md={8}>
                    <Form.Item
                        name="user_type"
                        label={`${Resources.userType}`}
                    >
                    <Select
                        // filterOption
                        onChange={this.changeUserType}
                        placeholder={Resources.choose}
                        // optionFilterProp="name"
                        style={{ display: "block" }}
                        // showSearch
                        >
                        <Select.Option  value="representative" >{Resources.representative}</Select.Option>
                        <Select.Option  value="customer" >{Resources.customer}</Select.Option>
                    </Select>
                </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Form.Item label={Resources.user} name="phone">
                        <Select
                            style={{height: "20px"}}
                            allowClear
                            filterOption={(input, option) => this.handleFilterSearchApi(input, option)}
                            onSearch={this.handleSearchUsers}
                            placeholder={Resources.search}
                            ref={this.inputRef}
                            className="ant-select-xl"
                            showSearch
                        >
                            {users.map(o => <Select.Option key={o.id} value={o.phone} name={o.phone} code={o.full_name + o.phone + o.value}>{o.phone }</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <br />
            <div className='set_middle_content m-3'><span>{Resources.devices}</span></div>
                <Form.List name="devices">
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Row gutter={24}>

                            <Fragment key={key}>
                                <Col xs={6}>
                                    <Form.Item
                                        name={[name, "IMEI"]}
                                        label={Resources.devide_model}
                                        {...restField}
                                    >
                                        <Select
                                            style={{height: "20px"}}
                                            allowClear
                                            filterOption={(input, option) => this.handleFilterSearchApi(input, option)}
                                            onSearch={this.handleSearchDevices}
                                            // onSelect={this.handleSelectDevice}
                                            onSelect = {(value, options) => this.handleSelectDevice(value, options, key)}
                                            placeholder={Resources.search}
                                            ref={this.inputRef}
                                            className="ant-select-xl"
                                            showSearch
                                        >
                                            {devices.map(o => <Select.Option key={o.id} value={o.IMEI} name={o.IMEI} code={o.Name + o.IMEI + o.value}>{o.IMEI }</Select.Option>)}
                                        </Select>
                                    </Form.Item>

                                </Col>
                                <Col xs={4}>
                                    <Form.Item
                                        name={[name, "serial"]}
                                        label={Resources.serial}
                                        {...restField}
                                        initialValue={selected_devices.find(item => item.key == key)?.data?.serial}
                                    >
                                        <Input></Input>

                                    </Form.Item>

                                </Col>
                                <Col xs={2}>
                                    <Form.Item
                                        name={[name, "otp"]}
                                        label={Resources.code}
                                        {...restField}
                                        initialValue={selected_devices.find(item => item.key == key)?.data?.OTP}
                                        
                                    >
                                        <Input  />
                                    </Form.Item>
                                </Col>
                                <Col xs={3}>
                                    <Form.Item
                                        name={[name, "repair_time"]}
                                        label={Resources.approximateTime}
                                        {...restField}
                                        initialValue={selected_devices.find(item => item.key == key)?.data?.repair_time}
                                        
                                    >
                                        <Input type='number'  />
                                    </Form.Item>
                                </Col>

                                <Col xs={3}>
                                    <Form.Item
                                        name={[name, "returned"]}
                                        label={Resources.returned}
                                        {...restField}
                                        
                                    >
                                        <Select placeholder={Resources.choose}>
                                            <Select.Option value={1}>{Resources.yes}</Select.Option>
                                            <Select.Option value={0}>{Resources.no}</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={3}>
                                    <Form.Item
                                        name={[name, "guarantee"]}
                                        label={Resources.guarantee}
                                        {...restField}
                                        initialValue={selected_devices.find(item => item.key == key)?.data?.ExpGuaranteeTime >= new Date().getSeconds() ? 1 : 0}
                                        
                                    >
                                        <Select placeholder={Resources.choose}>
                                            <Select.Option  value={1}>{Resources.yes}</Select.Option>
                                            <Select.Option value={0}>{Resources.no}</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={2}>
                                    <Button
                                        type="link"
                                        onClick={() => remove(name)}
                                        style={{
                                            marginTop: 32,
                                            padding: 0,
                                            color: 'red'
                                        }}
                                    
                                        block
                                    >
                                        <DeleteOutlined />
                                    </Button>
                                </Col>
                            </Fragment>
                            </Row>
                            ))}
                            <Col  xs={4} >
                                <Form.Item>
                                    <Button
                                        className='add_button_form_list'
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{
                                            marginTop: 5,
                                            padding: 0,
                                        }}
                                        block
                                                                                >
                                        {`${Resources.addDevice}`}
                                    </Button>
                                </Form.Item>
                            </Col>
                        
                            </>
                    )}
                </Form.List>
            <hr />

            <br />
            <div className='set_middle_content m-3'><span>{Resources.products}</span></div>
                <Form.List name="products">
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Row gutter={24}>

                            <Fragment key={key}>
                                <Col xs={6}>
                                    <Form.Item
                                        name={[name, "name"]}
                                        label={Resources.name}
                                        {...restField}
                                    >
                                        <Select
                                            style={{height: "20px"}}
                                            allowClear
                                            filterOption={(input, option) => this.handleFilterSearchApi(input, option)}
                                            onSearch={this.handleSearchProducts}
                                            // onSelect={this.handleSelectDevice}
                                            // onSelect = {(value, options) => this.handleSelectDevice(value, options, key)}
                                            placeholder={Resources.search}
                                            ref={this.inputRef}
                                            className="ant-select-xl"
                                            showSearch
                                        >
                                            {products.map(o => <Select.Option key={o.id} value={o.name} name={o.name} code={o.name + o.value}>{o.name }</Select.Option>)}
                                        </Select>
                                    </Form.Item>

                                </Col>
                                <Col xs={3}>
                                    <Form.Item
                                        name={[name, "serial"]}
                                        label={Resources.serial}
                                        {...restField}
                                    >
                                        <Input></Input>

                                    </Form.Item>

                                </Col>
                                <Col xs={2}>
                                    <Form.Item
                                        name={[name, "otp"]}
                                        label={Resources.code}
                                        {...restField}
                                        
                                    >
                                        <Input  />
                                    </Form.Item>
                                </Col>
                                <Col xs={3}>
                                    <Form.Item
                                        name={[name, "repair_time"]}
                                        label={Resources.approximateTime}
                                        {...restField}
                                        
                                    >
                                        <Input type='number'  />
                                    </Form.Item>
                                </Col>

                                <Col xs={3}>
                                    <Form.Item
                                        name={[name, "returned"]}
                                        label={Resources.returned}
                                        {...restField}
                                        
                                    >
                                        <Select placeholder={Resources.choose}>
                                            <Select.Option value={1}>{Resources.yes}</Select.Option>
                                            <Select.Option value={0}>{Resources.no}</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={3}>
                                    <Form.Item
                                        name={[name, "guarantee"]}
                                        label={Resources.guarantee}
                                        {...restField}
                                        initialValue={selected_devices.find(item => item.key == key)?.data?.ExpGuaranteeTime >= new Date().getSeconds() ? 1 : 0}
                                        
                                    >
                                        <Select placeholder={Resources.choose}>
                                            <Select.Option  value={1}>{Resources.yes}</Select.Option>
                                            <Select.Option value={0}>{Resources.no}</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={2}>
                                    <Button
                                        type="link"
                                        onClick={() => remove(name)}
                                        style={{
                                            marginTop: 32,
                                            padding: 0,
                                            color: 'red'
                                        }}
                                    
                                        block
                                    >
                                        <DeleteOutlined />
                                    </Button>
                                </Col>
                            </Fragment>
                            </Row>
                            ))}
                            <Col  xs={4} >
                                <Form.Item>
                                    <Button
                                        className='add_button_form_list'
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{
                                            marginTop: 5,
                                            padding: 0,
                                        }}
                                        block
                                                                                >
                                        {`${Resources.addProduct}`}
                                    </Button>
                                </Form.Item>
                            </Col>
                        
                            </>
                    )}
                </Form.List>
            <hr />

            <br />
            <div className='set_middle_content m-3'><span>{Resources.items}</span></div>
                <Form.List name="items">
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Row gutter={24}>

                            <Fragment key={key}>
                                <Col xs={6}>
                                    <Form.Item
                                        name={[name, "name"]}
                                        label={Resources.name}
                                        {...restField}
                                    >
                                        <Select
                                            style={{height: "20px"}}
                                            allowClear
                                            filterOption={(input, option) => this.handleFilterSearchApi(input, option)}
                                            onSearch={this.handleSearchItems}
                                            // onSelect={this.handleSelectDevice}
                                            // onSelect = {(value, options) => this.handleSelectDevice(value, options, key)}
                                            placeholder={Resources.search}
                                            ref={this.inputRef}
                                            className="ant-select-xl"
                                            showSearch
                                        >
                                            {items.map(o => <Select.Option key={o.id} value={o.name} name={o.name} code={o.name + o.value}>{o.name }</Select.Option>)}
                                        </Select>
                                    </Form.Item>

                                </Col>
                                
                              
                                <Col xs={6}>
                                    <Form.Item
                                        name={[name, "repair_time"]}
                                        label={Resources.approximateTime}
                                        {...restField}
                                        
                                    >
                                        <Input type='number'  />
                                    </Form.Item>
                                </Col>

                                <Col xs={6}>
                                    <Form.Item
                                        name={[name, "status"]}
                                        label={Resources.status}
                                        {...restField}
                                        
                                    >
                                        <Select placeholder={Resources.choose}>
                                            <Select.Option value="new">{Resources.new}</Select.Option>
                                            <Select.Option value="broken">{Resources.broken}</Select.Option>
                                            <Select.Option value="confused">{Resources.confused}</Select.Option>

                                        </Select>
                                    </Form.Item>
                                </Col>
                                
                                <Col xs={2}>
                                    <Button
                                        type="link"
                                        onClick={() => remove(name)}
                                        style={{
                                            marginTop: 32,
                                            padding: 0,
                                            color: "red"
                                        }}
                                        block
                                    >
                                        <DeleteOutlined />
                                    </Button>
                                </Col>
                            </Fragment>
                            </Row>
                          
                            ))}
                            <Col  xs={4} >
                                <Form.Item>
                                    <Button
                                        className='add_button_form_list'
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{
                                            marginTop: 5,
                                            padding: 0,
                                        }}
                                        block
                                                                                >
                                        {`${Resources.addItems}`}
                                    </Button>
                                </Form.Item>
                            </Col>
                        
                            </>
                    )}
                </Form.List>  
                <hr />

                <Row gutter={24}>
                    <Col xs={8}>
                        <Form.Item label={Resources.description} name="description" >
                            <Input.TextArea ></Input.TextArea>
                        </Form.Item>
                    </Col>
                </Row>
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
                    {/* <Col xs={8}>
                        <Form.Item name="confirm_transfer_to_accepted" 
                        valuePropName={confirm_transfer_to_accepted}
                        onChange={(e) => {
                            this.onChangeChecbox(e, "confirm_transfer_to_accepted");
                          }}
                        >
                            <Checkbox >
                                {Resources.confirm_transfer_to_accepted}
                            </Checkbox>
                        </Form.Item>
                    </Col>
                    <Col xs={8}>
                        <Form.Item name="transfer_to_repair_stage" 
                         valuePropName={transfer_to_repair_stage}
                        onChange={(e) => {
                            this.onChangeChecbox(e, "transfer_to_repair_stage");
                          }}
                        >
                            <Checkbox >
                                {Resources.transfer_to_repair_stage}
                            </Checkbox>
                        </Form.Item>
                    </Col> */}
                    <Col xs={8}>
                        <Form.Item name="send_sms_to_customer" 
                        valuePropName={send_sms_to_customer}
                        onChange={(e) => {
                            this.onChangeChecbox(e, "send_sms_to_customer");
                          }}
                        >
                            <Checkbox >
                                {Resources.send_sms_to_customer}
                            </Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>

      </Fragment>
    );
  }
}

export default ReceptionForm_old;
