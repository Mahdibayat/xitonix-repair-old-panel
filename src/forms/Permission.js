import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import { Checkbox, Form, List, Modal } from 'antd';
import Resources from '../scripts/resources';

class PermissionForm extends Component {
    constructor() {
        super();

        this.state = {};

        this.formRef = React.createRef();
    }

    handleSubmit = () => {
        this.formRef.current.validateFields().then(values => {
            this.props.onSubmit(values);
        });
    }

    handleWillUnmount = () => {
        this.formRef.current.resetFields();
    }

    handleDidMount = (data = {}) => {
        const cloneData = cloneDeep(data);

        this.formRef.current.setFieldsValue(cloneData);
    }

    render() {
        const { onCancel, submitting, visible } = this.props;

        return (
            <Modal
                title={Resources.edit}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={onCancel}
                okText={Resources.confirm}
                cancelText={Resources.cancel}
                okButtonProps={{ loading: submitting }}
                cancelButtonProps={{ disabled: submitting }}
                width={700}>
                <Form ref={this.formRef} layout="vertical">
                    <Form.Item name="rules">
                        <Checkbox.Group className="ant-checkbox-group-ltr" style={{ display: 'block' }}>
                            <List>
                                <List.Item>
                                    <List.Item.Meta title={Resources.dashboard} />
                                    <div className="ant-list-item-meta-description">
                                        <Checkbox value="dashboard_view">{Resources.show}</Checkbox>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta title={Resources.users} />
                                    <div className="ant-list-item-meta-description">
                                        <Checkbox value="user_option">{Resources.action}</Checkbox>
                                        <Checkbox value="user_store">{Resources.add}</Checkbox>
                                        <Checkbox value="user_list">{Resources.list}</Checkbox>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta title={Resources.phoneOrders} />
                                    <div className="ant-list-item-meta-description">
                                        <Checkbox value="voip_list">{Resources.list}</Checkbox>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta title={Resources.orders} />
                                    <div className="ant-list-item-meta-description">
                                        <Checkbox value="cart_option">{Resources.action}</Checkbox>
                                        <Checkbox value="cart_view">{Resources.show}</Checkbox>
                                        <Checkbox value="cart_list">{Resources.list}</Checkbox>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta title={Resources.specialOffers} />
                                    <div className="ant-list-item-meta-description">
                                        <Checkbox value="special_option">{Resources.action}</Checkbox>
                                        <Checkbox value="special_store">{Resources.add}</Checkbox>
                                        <Checkbox value="special_list">{Resources.list}</Checkbox>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta title={Resources.category} />
                                    <div className="ant-list-item-meta-description">
                                        <Checkbox value="category_option">{Resources.action}</Checkbox>
                                        <Checkbox value="category_store">{Resources.add}</Checkbox>
                                        <Checkbox value="category_list">{Resources.list}</Checkbox>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta title={Resources.products} />
                                    <div className="ant-list-item-meta-description">
                                        <Checkbox value="product_option">{Resources.action}</Checkbox>
                                        <Checkbox value="product_list">{Resources.list}</Checkbox>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta title={Resources.delivery} />
                                    <div className="ant-list-item-meta-description">
                                        <Checkbox value="postman_list">{Resources.list}</Checkbox>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta title={Resources.messages} />
                                    <div className="ant-list-item-meta-description">
                                        <Checkbox value="message_receipt">{Resources.receive}</Checkbox>
                                        <Checkbox value="message_store">{Resources.add}</Checkbox>
                                        <Checkbox value="message_list">{Resources.list}</Checkbox>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta title={Resources.settings} />
                                    <div className="ant-list-item-meta-description">
                                        <Checkbox value="setting_list">{Resources.list}</Checkbox>
                                    </div>
                                </List.Item>
                            </List>
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
};

export default PermissionForm;