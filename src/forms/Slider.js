import React, { Component, Fragment } from 'react';
import { cloneDeep } from 'lodash';
import { Col, Form, Input, Modal, Radio, Row, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Resources from '../scripts/resources';
import Rules from '../scripts/rules';

class SliderForm extends Component {
    constructor() {
        super();

        this.state = {
            fileList: []
        };

        this.formRef = React.createRef();
    }

    

    handleSubmit = () => {
        this.formRef.current.validateFields().then(values => {
            const formData = new FormData();

            formData.append('type', values.type);
            formData.append('location', values.location);
            formData.append('device', values.device);

            switch (values.type) {
                case 'category':
                    formData.append('value', values.subCategory ? values.subCategory : values.mainCategory);
                    break;
                case 'tag':
                    formData.append('value', values.tag);
                    break;
                case 'link':
                    formData.append('value', values.link);
                    break;
                default:
                    break;
            }

            if (values.image && values.image.fileList && values.image.fileList.length)
                formData.append('image', values.image.file, values.image.file.name);

            this.props.onSubmit(formData);
        });
    }

    handleWillUnmount = () => {
        this.formRef.current.resetFields();

        this.setState({ fileList: [] });
    }

    handleDidMount = (data = {}) => {
        const cloneData = cloneDeep(data);

        switch (cloneData.type) {
            case 'category':
                const category = this.props.categories.find(o => o.id === parseInt(cloneData.value));

                if (category) {
                    if (category.subCategory)
                        cloneData.subCategory = cloneData.value;
                    else
                        cloneData.mainCategory = cloneData.value;
                }
                break;
            case 'tag':
                cloneData.tag = parseInt(cloneData.value);
                break;
            case 'link':
                cloneData.link = cloneData.value;
                break;
            default:
                break;
        }

        this.formRef.current.setFieldsValue(cloneData);

        this.setState({ editMode: !!cloneData.id });
    }

    render() {
        const { categories, onCancel, submitting, tags, visible } = this.props;
        const { fileList, editMode } = this.state;

        const props = {
            onRemove: file => {
                this.setState({ fileList: [] });
            },
            beforeUpload: file => {
                this.setState({ fileList: [file] });
                return false;
            },
            showUploadList: {
                showRemoveIcon: editMode
            },
            fileList
        };

        return (
            <Modal
                title={editMode ? Resources.edit : Resources.add}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={onCancel}
                okText={Resources.confirm}
                cancelText={Resources.cancel}
                okButtonProps={{ loading: submitting }}
                cancelButtonProps={{ disabled: submitting }}
                width={700}>
                <Form ref={this.formRef} layout="vertical">
                    <Row gutter={24}>
                     
                        <Col xs={24}>
                            <Form.Item name="image" label={Resources.image} rules={editMode ? [] : Rules.required}>
                                <Upload.Dragger {...props}>
                                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                                    <p className="ant-upload-hint">{Resources.uploadText}</p>
                                </Upload.Dragger>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
};

export default SliderForm;