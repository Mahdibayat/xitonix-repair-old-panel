import React, { Component } from 'react';
import Resources from "../scripts/resources";

class PaginationInfo extends Component {
    render() {
        const { current, pageSize, style, total } = this.props;

        let paginationInfo = '';

        if (total <= pageSize)
            paginationInfo = `${Resources.show} 1 ${Resources.to} ${total} ${Resources.from} ${total} ${Resources.dataEntries}`;
        else if (current * pageSize >= total)
            paginationInfo = `${Resources.show} ${(current - 1) * pageSize + 1} ${Resources.to} ${total} ${Resources.from} ${total} ${Resources.dataEntries}`;
        else
            paginationInfo = `${Resources.show} ${(current - 1) * pageSize + 1} ${Resources.to} ${current * pageSize} ${Resources.from} ${total} ${Resources.dataEntries}`;

        return (
            <div className="ant-pagination-info" style={style}>{paginationInfo}</div>
        );
    }
};

export default PaginationInfo;
