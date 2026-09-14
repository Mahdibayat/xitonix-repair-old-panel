import React, { Component } from 'react';
import { Modal } from 'antd';
import Resources from '../scripts/resources';

class ModalForm extends Component {
    render() {
        const { children, onCancel, onOk, submitting, title, visible } = this.props;

        return (
            <Modal
                title={title}
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                okText={Resources.confirm}
                cancelText={Resources.cancel}
                okButtonProps={{ loading: submitting }}
                cancelButtonProps={{ disabled: submitting }}>
                {children}
            </Modal>
        );
    }
};

export default ModalForm;