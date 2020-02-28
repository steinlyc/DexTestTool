import React, { Component } from 'react'
import styles from './buyback.module.css'
import { Button, Table, Spin, message } from 'antd';
import Fibos from 'fibos.js'

export default class BuybackTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buybackInfo: [],
            spin: false
        }
        this.columns = [
            {
                title: '回购ID',
                dataIndex: 'repo_id',
                key: 'repo_id',
                align: 'center',
            },
            {
                title: '回购发起人',
                dataIndex: 'owner',
                key: 'owner',
                align: 'center',
            },
            {
                title: '剩余数量',
                dataIndex: 'quantity',
                key: 'quantity',
                align: 'center',
            },
            {
                title: '回购通证',
                dataIndex: 'to_sym',
                key: 'to_sym',
                align: 'center',
            },
            {
                title: '上次回购时间',
                dataIndex: 'update_at',
                key: 'update_at',
                align: 'center',
            },
            {
                title: '回购截止时间',
                dataIndex: 'expiration',
                key: 'expiration',
                align: 'center',
            },
        ]
    }

    componentDidMount(){
        this.getTable()
    }

    getTable = () => {
        this.setState({
            spin: true
        })
        const fibosClient = Fibos({
            chainId: "6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a",
            keyProvider: '5KkK3wvtgCY2kLbCV3ETcuW4MrSbbpxsXBNVYiCMzWjxTUnvK4G',
            httpEndpoint: "http://ln-rpc.fibos.io:8870",
        });
        fibosClient.getTableRows(true, "buyoutworker", "buyoutworker", "repospool").then(rs => {
            let resp = []
            if (rs.rows.length === 0) {
                message.error('未获取到回购数据')
            }
            for (let i = 0; i < rs.rows.length; i++) {
                let tmpUpdate = new Date(rs.rows[i].update_at)
                let tmpExpiration = new Date(rs.rows[i].expiration)
                let token = rs.rows[i].to_sym.sym.split(',')
                tmpUpdate = tmpUpdate.setHours(tmpUpdate.getHours() + 8)
                tmpExpiration = tmpExpiration.setHours(tmpExpiration.getHours() + 8)
                resp[i] = {
                    repo_id: rs.rows[i].repo_id,
                    owner: rs.rows[i].owner,
                    quantity: rs.rows[i].balance.quantity,
                    to_sym: token[1],
                    update_at: new Date(tmpUpdate).toLocaleString('chinese', { hour12: false }),
                    expiration: new Date(tmpExpiration).toLocaleString('chinese', { hour12: false }),
                    id: i
                }
            }
            this.setState({
                buybackInfo: resp,
                spin: false
            })
        }).catch(() => {
            message.error('未获取到回购数据')
            this.setState({
                spin: false
            })
        });
    }

    render() {
        const { columns } = this
        const { buybackInfo, spin } = this.state
        return (
            <div className={styles.tablerow}>
                <Button className={styles.searchTable} type="primary" onClick={this.getTable}>查询回购信息</Button>
                <Spin spinning={spin}>
                    <Table
                        columns={columns}
                        dataSource={buybackInfo}
                        rowKey={record => record.id}
                        pagination={false}
                    />
                </Spin>
            </div>
        )
    }
}
