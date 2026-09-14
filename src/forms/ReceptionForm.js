import React, { Component, Fragment } from "react";
import { Map, TileLayer, Marker, withLeaflet } from "react-leaflet";
import { ReactLeafletSearch } from "react-leaflet-search";
import { cloneDeep } from "lodash";
import { Button, Col, Form, Input, Modal, Row, Select, Checkbox, message } from "antd";
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


class ReceptionForm extends Component {
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
      submitting: false,
      cities: [],
      items_count: 0,
      devices_count: 0,
      kit_items: []
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
    }).catch(() => {
        this.setState({ submitting: false });
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
    await this.getSearchCities()

    
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

    // if(!this.state.user_type){
    //     message.error("نوع کاربر را انتخاب کنید")
    //     return
    // }
    if (value) {
      // this.handleSearchTimeOut(value)
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        //search function
        API.representative.list( {q: SearchFormat(value)}).then((result) => {
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


handleSearchKitItems = (value) => {
    if (value) {
      // this.handleSearchTimeOut(value)
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        //search function
        API.kit_items.search({q: SearchFormat(value), type: "accessory"}).then((result) => {
          if (result.data && result.data.length) {
            const kit_items = result.data.map(o => {
              return {
                id: o.id,
                name: o.name,
                value: value,
                count: 1
              }
            });

            this.setState({kit_items: kit_items});
          } else {
            this.setState({kit_items: []});
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


handleSelectUser = (value, options, key) => {
    API.representative.show(value).then((result) => {
        this.formRef.current.setFieldValue('full_name', result.data?.full_name);
        this.formRef.current.setFieldValue('city_id', result.data?.city_id);
       
    })
}

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

changeUserType = (value) => {
    this.setState({ user_type: value })
};

onChangeChecbox = (value, itemName) => {
  console.log(value.target.checked, itemName)
  // this.setState({itemName: value.target.checked})
  this.formRef.current.setFieldsValue({[itemName]: value.target.checked})
}
setDymicDataCount= (name, count) => {
    this.setState({[name] : count})
}
  render() {
    const { onCancel, submitting, visible } = this.props;
    const { editMode, devices, selected_devices, users, items, kit_items,cities,
        confirm_transfer_to_accepted, transfer_to_repair_stage, send_sms_to_customer, formRef
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
                <Col xs={24} md={4}>
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

                <Col xs={6}>
                    <Form.Item style={{width: "100%"}} label={Resources.fullName} name="full_name" >
                        <Input ></Input>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Form.Item label={Resources.phone} name="phone">
                        <Select
                            style={{height: "20px"}}
                            allowClear
                            filterOption={(input, option) => this.handleFilterSearchApi(input, option)}
                            onSearch={this.handleSearchUsers}
                            onSelect = {(value, options) => this.handleSelectUser(value, options)}

                            placeholder={Resources.search}
                            ref={this.inputRef}
                            className="ant-select-xl"
                            showSearch
                        >
                            {users.map(o => <Select.Option key={o.id} value={o.phone} name={o.phone} code={o.full_name + o.phone + o.value}>{o.phone }</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>
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
              
            </Row>

            <br />
            {/* <div className='set_middle_content m-3'><span>{Resources.devices}</span></div> */}
                <Form.List name="devices" 
                
                >
                    {(fields, { add, remove }) => (
                    <>
                        <div className='set_middle_content m-3'><span>{Resources.devices}</span> ( <span >{fields.length}</span>)</div>

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
                                            onSearch={this.handleSearchKitItems}
                                            // onSelect = {(value, options) => this.handleSelectUser(value, options)}

                                            placeholder={Resources.search}
                                            ref={this.inputRef}
                                            className="ant-select-xl"
                                            showSearch
                                        >
                                            {kit_items.map(o => <Select.Option key={o.id} value={o.name} name={o.name} code={o.name + o.value}>{o.name }</Select.Option>)}
                                        </Select>

                                    </Form.Item>

                                </Col>
                                <Col xs={6}>
                                    <Form.Item
                                        name={[name, "imei"]}
                                        label={Resources.IMEI}
                                        {...restField}
                                    >
                                        <Input></Input>

                                    </Form.Item>

                                </Col>
                                <Col xs={6}>
                                    <Form.Item
                                        name={[name, "serial"]}
                                        label={Resources.serial}
                                        {...restField}
                                    >
                                        <Input></Input>

                                    </Form.Item>

                                </Col>

                            
                                <Col xs={3}>
                                    <Form.Item
                                        name={[name, "otp"]}
                                        label={Resources.code}
                                        {...restField}
                                        initialValue={selected_devices.find(item => item.key == key)?.data?.OTP}
                                        
                                    >
                                        <Input  />
                                    </Form.Item>
                                </Col>
                                <Col xs={5}>
                                    <Form.Item
                                        name={[name, "repair_time"]}
                                        label={`${Resources.approximateTime} (${Resources.hour})`}
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
            {/* <div className='set_middle_content m-3'><span>{Resources.items}</span></div> */}
                <Form.List name="items">
                    {(fields, { add, remove }) => (
                       
                    <>
                        <div className='set_middle_content m-3'><span>{Resources.items}</span> ( <span >{fields.length}</span>)</div>

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
                                            onSearch={this.handleSearchKitItems}
                                            // onSelect = {(value, options) => this.handleSelectUser(value, options)}

                                            placeholder={Resources.search}
                                            ref={this.inputRef}
                                            className="ant-select-xl"
                                            showSearch
                                        >
                                            {kit_items.map(o => <Select.Option key={o.id} value={o.name} name={o.name} code={o.name + o.value}>{o.name }</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                
                              
                                <Col xs={6}>
                                    <Form.Item
                                        name={[name, "repair_time"]}
                                        label={`${Resources.approximateTime} (${Resources.hour})`}
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
                <hr />
                <Row gutter={24}>

                <Col xs={6}>
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

export default ReceptionForm;
