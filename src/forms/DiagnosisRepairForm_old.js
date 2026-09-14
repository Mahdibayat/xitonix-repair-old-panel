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


class DiagnosisRepairForm extends Component {
  constructor() {
    super();

    this.state = {
      devices:[],
      reception: {},
      device_parts: [],
      data: [],
      confirm_transfer_to_accepted: false,
      submitting: false,
      selected_devices_parts_health: [],
       selected_devices_parts_replacement: []
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
        this.setState({reception: result.data})
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





handleSearchDevicePart = (value) => {
    if (value) {
      // this.handleSearchTimeOut(value)
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        //search function
        API.device_part.search({q: SearchFormat(value), type: "product"}).then((result) => {
          if (result.data && result.data.length) {
            const device_parts = result.data.map(o => {
              return {
                id: o.id,
                name: o.name,
                price: o.price,
                value: value,
                count: 1
              }
            });

            this.setState({device_parts: device_parts});
          } else {
            this.setState({device_parts: []});
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


handleSelectDevicePartHealth = (value, options, key) => {
    const {selected_devices_parts_health} = this.state
    API.device_part.show(value).then((result) => {
        selected_devices_parts_health.push({key: key, data:  result.data})
        this.setState({selected_devices_parts_health: selected_devices_parts_health});
        const healthy_parts = this.formRef.current.getFieldValue('healthy_parts');
        healthy_parts[key] = { ...healthy_parts[key], ["price"]: result.data.price };
        this.formRef.current.setFieldValue('healthy_parts', healthy_parts);


    })
}
handleSelectDevicePartReplacement = (value, options, key) => {
    const {selected_devices_parts_replacement} = this.state
    API.device_part.show(value).then((result) => {
        selected_devices_parts_replacement.push({key: key, data:  result.data})
        this.setState({selected_devices_parts_replacement: selected_devices_parts_replacement});

        const replacement_parts = this.formRef.current.getFieldValue('replacement_parts');
        replacement_parts[key] = { ...replacement_parts[key], ["price"]: result.data.price };
        this.formRef.current.setFieldValue('replacement_parts', replacement_parts);

        
    })
}



onChangeChecbox = (value, itemName) => {
  console.log(value.target.checked, itemName)
  // this.setState({itemName: value.target.checked})
  this.formRef.current.setFieldsValue({[itemName]: value.target.checked})
}
  render() {
    const { onCancel, submitting, visible } = this.props;
    const { editMode, device_parts, selected_devices_parts_health, selected_devices_parts_replacement,
        reception,
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
            <div className='set_middle_content m-3'><span>{Resources.devices}</span></div>
            { (reception && reception.devices && reception.devices.length) &&
            <Row gutter={24}>
                {
                    reception.devices.map(item => {
                      return(  
                        <>
                            <Col md={8}>
                                <span>{Resources.devide_model}</span> : {item.IMEI}
                            </Col>
                            <Col md={5}>
                                <span>{Resources.serial}</span> : {item.serial}
                            </Col>
                            <Col md={5}>
                                <span>{Resources.code}</span> : {item.otp}
                            </Col>
                            <Col md={4}>
                                <span>{Resources.status}</span> : {item.sttaus}
                            </Col>
                        </>
                       
                      )
                    })
                    
                }
                

            </Row>
            }
            <br />
            <div className='set_middle_content m-3'><span>{Resources.products}</span></div>
            { (reception && reception.products && reception.products.length) &&
            <Row gutter={24}>
                {
                    reception.products.map(item => {
                      return(  
                        <>
                            <Col md={8}>
                                <span>{Resources.name}</span> : {item.name}
                            </Col>
                            <Col md={5}>
                                <span>{Resources.serial}</span> : {item.serial}
                            </Col>
                            <Col md={5}>
                                <span>{Resources.code}</span> : {item.otp}
                            </Col>
                            <Col md={4}>
                                <span>{Resources.status}</span> : {item.sttaus}
                            </Col>
                        </>
                       
                      )
                    })
                    
                }
                

            </Row>
            }
          <br />
            <div className='set_middle_content m-3'><span>{Resources.items}</span></div>
            { (reception && reception.items && reception.items.length) &&
            <Row gutter={24}>
                {
                    reception.items.map(item => {
                      return(  
                        <>
                            <Col md={8}>
                                <span>{Resources.name}</span> : {item.name}
                            </Col>
                            
                            <Col md={4}>
                                <span>{Resources.status}</span> : {item.sttaus}
                            </Col>
                        </>
                       
                      )
                    })
                    
                }
                

            </Row>
            }
            <hr />
              <br />
                    <div className='set_middle_content m-3'><span>{Resources.replacement_parts}</span></div>
                    <Form.List name="replacement_parts">
                                {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Row gutter={24}>
            
                                        <Fragment key={key}>
                                            <Col xs={8}>
                                                <Form.Item
                                                    name={[name, "name"]}
                                                    label={Resources.name}
                                                    {...restField}
                                                >
                                                    <Select
                                                        style={{height: "20px"}}
                                                        allowClear
                                                        filterOption={(input, option) => this.handleFilterSearchApi(input, option)}
                                                        onSearch={this.handleSearchDevicePart}
                                                        // onSelect={this.handleSelectDevice}
                                                        onSelect = {(value, options) => this.handleSelectDevicePartReplacement(value, options, key)}
                                                        placeholder={Resources.search}
                                                        ref={this.inputRef}
                                                        className="ant-select-xl"
                                                        showSearch
                                                    >
                                                        {device_parts.map(o => <Select.Option key={o.id} value={o.name} name={o.name} code={o.name + o.value}>{o.name }</Select.Option>)}
                                                    </Select>
                                                </Form.Item>
            
                                            </Col>
                                            <Col xs={4}>
                                                <Form.Item
                                                    name={[name, "price"]}
                                                    label={Resources.price}
                                                    {...restField}
                                                    // initialValue={selected_devices_parts_replacement.find(item => item.key == key)?.data?.price}
                                                >
                                                    <Input type="number"></Input>
    
                                                </Form.Item>
                                                
                                            </Col>
                                         
                                           
            
                                            <Col xs={3}>
                                                <Form.Item
                                                    name={[name, "guarantee"]}
                                                    label={Resources.guarantee}
                                                    {...restField}
                                                    
                                                >
                                                    <Select placeholder={Resources.choose}>
                                                        <Select.Option value={1}>{Resources.yes}</Select.Option>
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
                                                    {`${Resources.add_part}`}
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    
                                        </>
                                )}
                    </Form.List>
                    <hr />

                    <div className='set_middle_content m-3'><span>{Resources.healthy_parts}</span></div>
                    <Form.List name="healthy_parts">
                                {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Row gutter={24}>
            
                                        <Fragment key={key}>
                                            <Col xs={8}>
                                                <Form.Item
                                                    name={[name, "name"]}
                                                    label={Resources.name}
                                                    {...restField}
                                                >
                                                    <Select
                                                        style={{height: "20px"}}
                                                        allowClear
                                                        filterOption={(input, option) => this.handleFilterSearchApi(input, option)}
                                                        onSearch={this.handleSearchDevicePart}
                                                        // onSelect={this.handleSelectDevice}
                                                        onSelect = {(value, options) => this.handleSelectDevicePartHealth(value, options, key)}
                                                        placeholder={Resources.search}
                                                        ref={this.inputRef}
                                                        className="ant-select-xl"
                                                        showSearch
                                                    >
                                                        {device_parts.map(o => <Select.Option key={o.id} value={o.name} name={o.name} code={o.name + o.value}>{o.name }</Select.Option>)}
                                                    </Select>
                                                </Form.Item>
            
                                            </Col>
                                            <Col xs={4}>
                                                <Form.Item
                                                    name={[name, "price"]}
                                                    label={Resources.price}
                                                    {...restField}
                                                >
                                                    <Input type="number"></Input>
            
                                                </Form.Item>
            
                                            </Col>
                                         
                                           
            
                                            <Col xs={3}>
                                                <Form.Item
                                                    name={[name, "guarantee"]}
                                                    label={Resources.guarantee}
                                                    {...restField}
                                                    
                                                >
                                                    <Select placeholder={Resources.choose}>
                                                        <Select.Option value={1}>{Resources.yes}</Select.Option>
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
                                                    {`${Resources.add_part}`}
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

export default DiagnosisRepairForm;
