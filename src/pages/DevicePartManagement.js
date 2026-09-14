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
import DevicePartForm from "../forms/DevicePartForm"



import { PriceFormat, SearchFormat } from "../scripts/helpers";




class DevicePartManagement extends Component {
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
        };
        this.formRef = React.createRef()
        this.receptionListRef = React.createRef()
    }
    fetch = (params = {}) => {
        const { filterLevel, filterSearch } = this.state;

        params.q = filterSearch;
        params.level = filterLevel;

        this.setState({ loading: true });

        API.device_part.list(params)
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
   
  
    handleSubmit = (values, i) => {
        this.setState({ submitting: true });
        const action = this.state.selected?.id ? API.device_part.update : API.device_part.store;

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
                API.device_part.delete(record.id)
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
    render() {
        const { visibleAddForm, data, loading, submitting, pagination } = this.state;

      
        const columns = [{
            title: Resources.name,
            dataIndex: 'name',
        }, {
            title: `${Resources.price} (${Resources.toman})`,
            dataIndex: 'price',
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
        return (


            <Fragment>
                <Breadcrumb>
                    <Breadcrumb.Item>{Resources.parts}</Breadcrumb.Item>
                </Breadcrumb>
                <Row gutter={24}>
                    <Col xs={24} md={4}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => this.showAddForm()} block>{Resources.add}</Button>
                    </Col>
                </Row>
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
                <DevicePartForm ref={this.formRef} onCancel={this.hideAddForm} onSubmit={this.handleSubmit} submitting={submitting} visible={visibleAddForm} />

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
)(DevicePartManagement);
