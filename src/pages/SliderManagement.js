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
import PaginationInfo from '../components/PaginationInfo';
import SliderForm from "../forms/Slider"


class SliderManagement extends Component {
    constructor() {
      super();
  
      this.state = {
        categories: [],
        data: [],
        pagination: {
          total: 0,
          current: 1,
          pageSize: Constants.pageSize,
          size: "small",
        },
        tags: [],
      };
  
      this.formRef = React.createRef();
    }
  
    fetch = (params = {}) => {
      this.setState({ loading: true });
  
      API.slider
        .list(params)
        .then((result) => {
          if (result.data) {
            this.setState({
              loading: false,
              data: result.data.data,
              pagination: {
                ...this.state.pagination,
                ...{
                  current: result.data.current_page,
                  pageSize: result.data.per_page,
                  total: result.data.total,
                },
              },
            });
          } else {
            this.setState({ loading: false });
          }
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    };
  
    showForm = (slider = {}) => {
      this.setState({ visibleForm: true, selected: slider });
  
      setTimeout(() => {
        this.formRef.current.handleDidMount(slider);
      }, 0);
    };
  
    hideForm = () => {
      this.setState({ visibleForm: false });
  
      setTimeout(() => {
        this.formRef.current.handleWillUnmount();
      }, 0);
    };
  
    handleDelete = (id) => {
      Modal.confirm({
        title: Resources.confirmDelete,
        okText: Resources.yes,
        okType: "danger",
        cancelText: Resources.no,
        onOk: () => {
          this.setState({ loading: true });
  
          API.slider
            .delete(id)
            .then((result) => {
              message.success(result.message);
              this.fetch({ page: this.state.pagination.current });
            })
            .catch(() => {
              this.setState({ loading: false });
            });
        },
      });
    };
  
    handleSubmit = (values) => {
      const action = this.state.selected.id ? API.slider.update : API.slider.add;
  
      this.setState({ submitting: true });
  
      action(values, this.state.selected.id)
        .then((result) => {
          message.success(result.message);
          this.setState({ submitting: false });
          this.hideForm();
          this.fetch({ page: this.state.pagination.current });
        })
        .catch(() => {
          this.setState({ submitting: false });
        });
    };
  
    handleTable = (pagination) => {
      this.fetch({ page: pagination.current });
    };
  
    componentDidMount() {
      this.fetch({ page: 1 });
  
     
    }
  
    render() {
      const {
        categories,
        data,
        loading,
        pagination,
        submitting,
        tags,
        visibleForm,
      } = this.state;
  
      const columns = [
        {
          title: Resources.image,
          dataIndex: "path",
          render: (val) => (
            <Tooltip
              title={
                <Avatar
                  src={`${Constants.imagePathSlider}${val}`}
                  shape="square"
                  size={200}
                />
              }
            >
              <Avatar
                src={`${Constants.imagePathSlider}${val}`}
                shape="square"
                size="small"
              />
            </Tooltip>
          ),
        },    
        {
          title: Resources.action,
          dataIndex: "id",
          className: "col-center",
          width: "120px",
          render: (val, record) => (
            <Fragment>
              {/* <Tooltip title={Resources.edit}>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => this.showForm(record)}
                />
              </Tooltip> */}
              <Tooltip title={Resources.delete}>
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => this.handleDelete(val)}
                  style={{color: "red"}}
                />
              </Tooltip>
            </Fragment>
          ),
        },
      ];
  
      return (
        <Fragment>
          <Row gutter={24} style={{ marginBottom: 16 }}>
            <Col xs={24} md={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => this.showForm()}
                block
              >
                {Resources.add}
              </Button>
            </Col>
          </Row>
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
          {!!pagination.total && (
            <PaginationInfo
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              style={{ bottom: 0, right: 0 }}
            />
          )}
          <SliderForm
            ref={this.formRef}
            onCancel={this.hideForm}
            onSubmit={this.handleSubmit}
            submitting={submitting}
            visible={visibleForm}
            categories={categories}
            tags={tags}
          />
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
)(SliderManagement);
