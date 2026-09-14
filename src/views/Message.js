import React, { Component } from 'react';
import { List, Modal } from 'antd';
import Resources from '../scripts/resources';

class MessageView extends Component {
    render() {
        const { data, onClose, visible } = this.props;

        return (
            <Modal
                title={Resources.view}
                visible={visible}
                onCancel={onClose}
                footer={false}
                width={1000}>
                <List>
                    {data.user && <List.Item>
                        <List.Item.Meta title={Resources.fullName} description={data.user.name ? `${data.user.name} ${data.user.family}` : data.user.family} />
                    </List.Item>}
                    <List.Item>
                        <List.Item.Meta title={Resources.title} description={data.title} />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta title={`${Resources.text} ${Resources.message}`} description={data.body} />
                    </List.Item>
                </List>
            </Modal>
        );
    }
};

export default MessageView;