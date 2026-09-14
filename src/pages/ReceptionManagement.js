import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {CheckPermission, getReceptionStatus} from "../scripts/helpers";
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
import ReceptionForm from "../forms/ReceptionForm"



import { PriceFormat, SearchFormat } from "../scripts/helpers";
import MenuHeader from '../components/menuHeader';
import menuHeader from '../components/menuHeader';




class ReceptionManagement extends Component {

    constructor() {
        super();

        this.state = {
            data: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: Constants.pageSize,
                size: 'small'
            },
            cityList: []
        };
        this.formRef = React.createRef()
        this.receptionSearchListRef = React.createRef()
    }

    fetch = (params = {}) => {
        const { filterLevel, filterSearch } = this.state;

        params.q = filterSearch;
        params.level = filterLevel;
        params.status = 0

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
  
    showAddForm = (user = {}) => {
        this.setState({ visibleAddForm: true, selected: user });

        setTimeout(() => {
            this.formRef.current.handleDidMount(user);
        }, 0);
    };

    hideAddForm = () => {
        this.setState({ visibleAddForm: false });

        setTimeout(() => {
            this.formRef.current.handleWillUnmount();
        }, 0);
    };
    
    handleSubmit = (values) => {
        this.setState({ submitting: true });
        const action = this.state.selected?.id ? API.reception.update : API.reception.store;

        action(this.state.selected.id, values)
            .then(async(result) => {
                await this.hideAddForm();
                await this.fetch()
                this.setState({ submitting: false });

            })
            .catch(() => {
                this.setState({ submitting: false });
            });
    };

    componentDidMount() {
        const { onSetRoute, routeName, parentName } = this.props;

        onSetRoute({ openKey: parentName, selectedKey: routeName });

        this.getSearchCities()
        this.fetch();
    }

    handleDelete = (record) => {
        Modal.confirm({
            title: Resources.confirmDelete,
            okText: Resources.yes,
            okType: 'danger',
            cancelText: Resources.no,
            onOk: () => {
                this.setState({loading : true});
                API.reception.delete(record.id)
                    .then(res => {
                        message.success(Resources.successful);
                        this.fetch()
                    })
                    .catch(() => {
                        this.setState({ loading: false });
                    });
            }
        });
    };

    getSearchCities = (params = {}) => {
        this.setState({ loading: true });
        API.city.list(params)

            .then((result) => {
                if (result.data) {
                    this.setState({
                        loading: false,
                        cityList: result.data,
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

        const { visibleAddForm, data, loading, submitting, pagination, cityList } = this.state;
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
        {
            title: Resources.status,
            dataIndex: 'status',
            render: val =>  getReceptionStatus(val),
        },
        
        {
            title: Resources.action,
            dataIndex: 'id',
            className: 'col-center',
            width: '120px',
            render: (val, record) => (
                <Fragment>
                    <Tooltip title={Resources.edit}>
                        <Button type="link" icon={<EditOutlined />} onClick={() => this.showAddForm(record)} />
                    </Tooltip>
                    <Tooltip title={Resources.delete}>
                        <Button style={{color: "red"}} type="link" icon={<DeleteOutlined />} onClick={() => this.handleDelete(record)} />
                    </Tooltip>
                </Fragment>
            )
        }
    ];

    const onFinish = (values) => {
        this.fetch({
            mobile: values.mobile,
            full_name: values.full_name,
            city_id:  values.neighborhood_id,
            category_id: values.city_id,
            user_type:  values.user_type,
        })
    }
        return (


            <Fragment>
                {menuHeader}
                <Breadcrumb>
                    <Breadcrumb.Item>{Resources.reception}</Breadcrumb.Item>
                </Breadcrumb>
                <Row gutter={24}>
                    <Col xs={24} md={4}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => this.showAddForm()} block>{Resources.newReception}</Button>
                    </Col>
                </Row>
                <hr />
                    <Form ref={this.receptionSearchListRef} layout="vertical"   onFinish={onFinish} >
                        <Row gutter={24}>
                            <Col xs={24} md={4}>
                                <Form.Item name="city_id" label={Resources.city}  >
                                    <Select showSearch
                                        filterOption={(input, option) => {
                                            return (
                                                option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            );
                                        }}
                                        allowClear={true}>
                                        {cityList.map(item => (
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
                                <Form.Item name="mobile"   label={Resources.mobile}>
                                    <Input type="number"   />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={4}>
                                <Form.Item name="user_type" label={Resources.userType}  >
                                    <Select 
                                        showSearch
                                        allowClear={true}>
                                        <Select.Option  value="">----</Select.Option>  
                                        <Select.Option  value="customer">{Resources.customer}</Select.Option>  
                                        <Select.Option  value="representative">{Resources.representative}</Select.Option>  
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={4} style={{marginTop: "3%"}}>
                                <Button type="primary" htmlType="submit">{Resources.search}</Button>
                            </Col>
                        </Row>
                        
                    </Form>
                <div className="ant-content">
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
                <ReceptionForm ref={this.formRef} onCancel={this.hideAddForm} onSubmit={this.handleSubmit} submitting={submitting} visible={visibleAddForm} />

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
