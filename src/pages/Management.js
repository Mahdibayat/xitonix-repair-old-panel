import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {CheckPermission} from "../scripts/helpers";
import {Constants, Permissions} from "../scripts/settings";
import {SetConsulting, SetRoute} from "../scripts/action";
import API from "../scripts/api";
import {
    Button,
    Col,
    Dropdown,
    Input,
    message,
    Row,
    Table,
    Tooltip,
    Checkbox,
    Breadcrumb,
    Menu,
    Avatar,
    Modal, Form, Select, Switch, Tabs, InputNumber, TimePicker
} from "antd";
import {ReadOutlined, SearchOutlined, MenuOutlined, PlusOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons'
// import FormBuilderItemForm from "../../forms/FormBuilder/FormBuilderItemForm";
import Resources from "../scripts/resources";
import moment from "moment-jalaali";
import { debounce, cloneDeep } from 'lodash';
import PaginationInfo from '../components/PaginationInfo';



import { PriceFormat, SearchFormat } from "../scripts/helpers";

class NewReceptionManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: Constants.pageSize,
                size: 'small'
            },
            selected: {},
            users: [],
            devices: [],
            selected_devices: [],
            user_type: "",
            confirm_transfer_to_accepted : false,
            transfer_to_repair_stage: false,
            send_sms_to_customer : false,
        };
        this.formRef = React.createRef();
    }

    fetch = (params = {}) => {
        const { filterLevel, filterSearch } = this.state;

        params.q = filterSearch;
        params.level = filterLevel;

        this.setState({ loading: true });

        API.FormBuilderItem.list(params)
            .then((result) => {
                if (result.data){
                    this.setState({
                        loading: false,
                        data: result.data,
                        pagination: {
                            ...this.state.pagination, ...{
                                current: result.current_page,
                                pageSize: result.per_page,
                                total: result.total
                            }
                        }
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    };

    componentDidMount=async () => {
        console.log("ffffff")
        // const { onSetRoute, routeName, parentName } = this.props;
        // onSetRoute({ openKey: parentName, selectedKey: routeName });
        // await this.getCategoriesLevel1()
    }

    handleSubmit = (values, i) => {
        this.setState({ submitting: true });
        const action = this.state.selected._id ? API.FormBuilderItem.update : API.FormBuilderItem.create;
        action(this.state.selected._id, values)
            .then((result) => {
                message.success(result.message);
                this.setState({ submitting: false });
                this.hideAddForm();
                this.fetch({ page: this.state.pagination.current, category_id: this.state.category_id  });
            })
            .catch(() => {
                this.setState({ submitting: false });
            });
    };

    showAddForm = (FBItem = {}) => {
        this.setState({ visibleAddForm: true, selected: FBItem });

        setTimeout(() => {
            this.formRef.current.handleDidMount(FBItem);
        }, 0);
    };

    hideAddForm = () => {
        this.setState({ visibleAddForm: false });

        setTimeout(() => {
            this.formRef.current.handleWillUnmount();
        }, 0);
    };

    handleDelete = (record) => {
        Modal.confirm({
            title: Resources.confirmDelete,
            okText: Resources.yes,
            okType: 'danger',
            cancelText: Resources.no,
            onOk: () => {
                this.setState({loading : true});
                API.FormBuilderItem.delete(record._id)
                    .then(res => {
                        message.success(Resources.success);
                        this.fetch({ page: this.state.pagination.current, category_id: this.state.category_id  });
                    })
                    .catch(() => {
                        this.setState({ loading: false });
                    });
            }
        });
    };

    handleFilter = (value) => {
        this.setState({ Filter: value });
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
                const devices = result.data.map(o => {
                  return {
                    id: o.id,
                    name: o.name,
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
    handleSearchItems = (value) => {
        if (value) {
          // this.handleSearchTimeOut(value)
          if (this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            //search function
            API.product.list({q: SearchFormat(value), type: "accessory"}).then((result) => {
              if (result.data && result.data.length) {
                const devices = result.data.map(o => {
                  return {
                    id: o.id,
                    name: o.name,
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
        const{ visibleAddForm, submitting,
            loading, pagination, users, devices, selected_devices } = this.state;
        const { permissions } = this.props;

        const onFinish = async (values) => {
            // this.setState({
            //     category_id: values.category_id,
            // });
            // this.fetch({ page: this.state.pagination.current, category_id: values.category_id  });
            await API.reception.store(values).then((result) => {

                console.log(result)
            })
        };

        return (
            <Fragment>
                {/* <Breadcrumb>
                    <Breadcrumb.Item>{Resources.reception}</Breadcrumb.Item>
                </Breadcrumb> */}
                <div className='ant-content'>


                        <Form ref={this.formRef} layout="vertical"   onFinish={onFinish} >

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
                                    <Form.Item label={Resources.user} name="user_id">
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
                                            {users.map(o => <Select.Option key={o.id} value={o.id} name={o.full_name} code={o.full_name + o.phone + o.value}>{o.full_name }</Select.Option>)}
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
                                                <Col xs={4}>
                                                    <Form.Item
                                                        name={[name, "id"]}
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
                                                            {devices.map(o => <Select.Option key={o.id} value={o.id} name={o.IMEI} code={o.Name + o.IMEI + o.value}>{o.Name + " "+o.IMEI }</Select.Option>)}
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
                                                <Col xs={4}>
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
                                                <Col xs={4}>
                                                    <Form.Item
                                                        name={[name, "id"]}
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
                                                            {devices.map(o => <Select.Option key={o.id} value={o.id} name={o.name} code={o.name + o.value}>{o.name }</Select.Option>)}
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
                                                <Col xs={4}>
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
                                                        name={[name, "id"]}
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
                                                            {devices.map(o => <Select.Option key={o.id} value={o.id} name={o.name} code={o.name + o.value}>{o.name }</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>

                                                </Col>
                                                
                                               
                                                <Col xs={6}>
                                                    <Form.Item
                                                        name={[name, "repair_time"]}
                                                        label={Resources.approximateTime}
                                                        {...restField}
                                                        initialValue={selected_devices.find(item => item.key == key)?.data?.repair_time}
                                                        
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
                                            <Input.TextArea >
                                               
                                            </Input.TextArea>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col xs={8}>
                                        <Form.Item name="confirm_transfer_to_accepted" 
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
                                        onChange={(e) => {
                                            this.onChangeChecbox(e, "transfer_to_repair_stage");
                                          }}
                                        >
                                            <Checkbox >
                                                {Resources.transfer_to_repair_stage}
                                            </Checkbox>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={8}>
                                        <Form.Item name="send_sms_to_customer" 
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



                            <Row gutter={24}>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        size="large"
                                        htmlType="submit"
                                        loading={submitting}
                                        block
                                    >
                                        {Resources.finalRegister}
                                    </Button>
                                </Form.Item>
                            </Row>

                        </Form>
                       
                        
                        
                       
                   
                </div>
            </Fragment>
        );
    }
}

class ReceptioListnManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: Constants.pageSize,
                size: 'small'
            },
            selected: {},
            users: [],
            devices: [],
            selected_devices: [],
            user_type: "",
           data: []
        };
        this.formRef = React.createRef();
    }

    fetch = (params = {}) => {
        const { filterLevel, filterSearch } = this.state;

        params.q = filterSearch;
        params.level = filterLevel;

        this.setState({ loading: true });

        API.reception.list(params)
            .then((result) => {
                if (result.data){
                    this.setState({
                        loading: false,
                        data: result.data.data,
                        pagination: {
                            ...this.state.pagination, ...{
                                current: result.data.current_page,
                                pageSize: result.data.per_page,
                                total: result.data.total
                            }
                        }
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    };

    componentDidMount=async () => {
        await this.fetch()
        // const { onSetRoute, routeName, parentName } = this.props;
        // onSetRoute({ openKey: parentName, selectedKey: routeName });
        // await this.getCategoriesLevel1()
    }

    handleSubmit = (values, i) => {
        this.setState({ submitting: true });
        const action = this.state.selected._id ? API.FormBuilderItem.update : API.FormBuilderItem.create;
        action(this.state.selected._id, values)
            .then((result) => {
                message.success(result.message);
                this.setState({ submitting: false });
                this.hideAddForm();
                this.fetch({ page: this.state.pagination.current, category_id: this.state.category_id  });
            })
            .catch(() => {
                this.setState({ submitting: false });
            });
    };

    showAddForm = (FBItem = {}) => {
        this.setState({ visibleAddForm: true, selected: FBItem });

        setTimeout(() => {
            this.formRef.current.handleDidMount(FBItem);
        }, 0);
    };

    hideAddForm = () => {
        this.setState({ visibleAddForm: false });

        setTimeout(() => {
            this.formRef.current.handleWillUnmount();
        }, 0);
    };

    handleDelete = (record) => {
        Modal.confirm({
            title: Resources.confirmDelete,
            okText: Resources.yes,
            okType: 'danger',
            cancelText: Resources.no,
            onOk: () => {
                this.setState({loading : true});
                API.FormBuilderItem.delete(record._id)
                    .then(res => {
                        message.success(Resources.success);
                        this.fetch({ page: this.state.pagination.current, category_id: this.state.category_id  });
                    })
                    .catch(() => {
                        this.setState({ loading: false });
                    });
            }
        });
    };

    handleFilter = (value) => {
        this.setState({ Filter: value });
    }

    render() {
        const{ visibleAddForm, submitting,
            loading, pagination, data } = this.state;
        const { permissions } = this.props;

       
        const columns = [{
            title: Resources.user,
            dataIndex: 'user',
            render: val => val?.full_name
        }, {
            title: `${Resources.city}`,
            dataIndex: 'user',
            render: val => val?.city?.name
        }, {
            title: Resources.mobile,
            dataIndex: 'user',
            render: val => val?.phone
        }, {
            title: Resources.type,
            dataIndex: 'user',
            render: val => val?.type
        }, 
        {
            title: Resources.registerDate,
            dataIndex: 'created_at',
            render: val =>  moment(val).format(Constants.jDateTimeFormat),
        },
        
        // {
        //     title: Resources.action,
        //     dataIndex: 'id',
        //     className: 'col-center',
        //     width: '120px',
        //     render: (val, record) => (
        //         <Fragment>
        //             <Tooltip title={Resources.edit}>
        //                 <Button type="link" icon={<EditOutlined />} onClick={() => this.showForm(record)} />
        //             </Tooltip>
        //             <Tooltip title={Resources.delete}>
        //                 <Button type="link" icon={<DeleteOutlined />} onClick={() => this.handleDelete(val)} />
        //             </Tooltip>
        //         </Fragment>
        //     )
        // }
    ];

        return (

            <Fragment>
              
                <div className='ant-content'>

                    <Table
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        onChange={this.handleTable}
                        pagination={pagination}
                        size="small"
                        rowKey="id"
                        scroll={{ x: 600 }}
                    />
                    {!!pagination.total && <PaginationInfo current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} style={{ bottom: 0, right: 0 }} />}
                   
                </div>
            </Fragment>
        );
    }
}
class ReceptionManagement extends Component {
    constructor() {
        super();

        this.state = {
            activeTab: '1',
            data: {},
            
        };
        this.newReceptionRef = React.createRef()
        this.receptionListRef = React.createRef()
    }

    fetch = () => {
        this.setState({ loading: true });

       
    }

  

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
        setTimeout(() => {
            const data = cloneDeep(this.state.data);
            switch (tab) {
                case "1":
                    this.newReceptionRef.current.componentDidMount(data);
                    break;
                case "2":
                    this.receptionListRef.current.componentDidMount(data);
                    break;
                default:
                    break;
            }
        }, 0);
    }

    handleSubmit = (values) => {
        console.log(values)
        this.setState({ submitting: true });

        const formData = new FormData();
    }

    componentDidMount() {
        const { onSetRoute, routeName, parentName } = this.props;

        onSetRoute({ openKey: parentName, selectedKey: routeName });

        this.fetch();
    }

    render() {
        const { activeTab, data, loading, submitting } = this.state;

      
     
        return (


            <Fragment>
                <Breadcrumb>
                    <Breadcrumb.Item>{Resources.reception}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="ant-content">
                    <Tabs activeKey={activeTab} type="card" onTabClick={this.handleTabChange}>
                        <Tabs.TabPane tab={Resources.newReception} key="1" >
                            <NewReceptionManagement 
                                ref={this.newReceptionRef}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={Resources.receptionList} key="2" >
                            <ReceptioListnManagement
                                ref={this.receptionListRef}
                            />
                        </Tabs.TabPane>
                        
                    </Tabs>
                </div>
            </Fragment>
        );
    }
}

export default connect(
    (state) => {
        return {
            permissions: {
                action: CheckPermission(state.app.user, Permissions.user_option),
                add: CheckPermission(state.app.user, Permissions.user_store)
            }
        };
    },
    (dispatch) => {
        return {
            onSetRoute: (data) => dispatch(SetRoute(data)),
            // setConsulting: data => dispatch(SetConsulting(data))
        };
    }
)(ReceptionManagement);
