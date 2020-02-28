import React, { Component } from 'react'
import styles from './order.module.css'
import { Button, Table, Spin, message } from 'antd';
import Fibos from 'fibos.js'

export default class Order extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pairData: [],
            spin: false,
            tableSpin: false,
            tempRc: ''
        }
        this.columns = [
            {
                title: '列表序号',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
            },
            {
                title: '交易对编号',
                dataIndex: 'primary',
                key: 'primary',
                align: 'center',
            },
            {
                title: '底仓 X',
                dataIndex: 'tokenx',
                key: 'tokenx',
                align: 'center',
            },
            {
                title: '底仓 Y',
                dataIndex: 'tokeny',
                key: 'tokeny',
                align: 'center',
            },
            {
                title: '权重',
                dataIndex: 'total_weights',
                key: 'total_weights',
                align: 'center',
            },
        ]
        this.childTbale = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
            },
            {
                title: '订单号',
                dataIndex: 'bid_id',
                key: 'bid_id',
                align: 'center',
            },
            {
                title: 'filled',
                dataIndex: 'filled',
                key: 'filled',
                align: 'center',
            },
            {
                title: '账号',
                dataIndex: 'owner',
                key: 'owner',
                align: 'center',
            },
            {
                title: '数量',
                dataIndex: 'quantity',
                key: 'quantity',
                align: 'center',
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                align: 'center',
            },
        ]
    }

    getPrimary = () => {
        this.setState({
            spin: true
        })
        const fibosClient = Fibos({
            chainId: "6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a",
            keyProvider: '5KkK3wvtgCY2kLbCV3ETcuW4MrSbbpxsXBNVYiCMzWjxTUnvK4G',
            httpEndpoint: "http://ln-rpc.fibos.io:8870",
        });
        fibosClient.getTableRows({
            json: true,
            code: 'eosio.token',
            scope: 'eosio.token',
            table: 'swapmarket',
            lower_bound: 0,
            upper_bound: -1,
            limit: 100,
        }).then(res => {
            let tmpdata = [];
            for (let i = 0; i < res.rows.length; i++) {
                tmpdata[i] = {
                    primary: res.rows[i].primary,
                    tokenx: res.rows[i].tokenx.quantity.concat("@" + res.rows[i].tokenx.contract),
                    tokeny: res.rows[i].tokeny.quantity.concat("@" + res.rows[i].tokeny.contract),
                    total_weights: Number(res.rows[i].total_weights).toFixed(6),
                    id: i + 1
                }
            }
            this.setState({
                pairData: tmpdata,
                spin: false
            })
        }).catch(() => {
            message.error('未获取到回购数据')
            this.setState({
                spin: false
            })
        })
    }

    expandedRowRender = (record) => {
        const { tableSpin, tempRc } = this.state
        return (
            <Spin spinning={tempRc === record.id ? tableSpin : false} >
                <Table columns={this.childTbale} dataSource={this.state[record.id]} pagination={false} rowKey={record => record.id} />
            </Spin>
        );
    }

    getOrder = (expanded, record) => {
        this.setState({
            tempRc: record.id
        })
        if (expanded === true) {
            this.setState({
                tableSpin: true
            })
            let value = Number(record.primary)
            let id = value
            const fibosClient = Fibos({
                chainId: "6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a",
                keyProvider: '5KkK3wvtgCY2kLbCV3ETcuW4MrSbbpxsXBNVYiCMzWjxTUnvK4G',
                httpEndpoint: "http://ln-rpc.fibos.io:8870",
            });

            fibosClient.getTableRows({
                json: true,
                code: "eosio.token",
                scope: id,
                table: 'swaporder',
                limit: 20000,
                lower_bound: 0
            }).then(res => {
                let tmpdata = [];
                for (let i = 0; i < res.rows.length; i++) {
                    tmpdata[i] = {
                        bid_id: res.rows[i].bid_id,
                        filled: res.rows[i].filled.quantity,
                        owner: res.rows[i].owner,
                        quantity: res.rows[i].quantity.quantity,
                        price: (1 / ((res.rows[i].price) / Math.pow(2, 32))).toFixed(6),
                        id: i + 1
                    }
                }
                tmpdata = tmpdata.sort((a, b) => {
                    return a.owner.localeCompare(b.owner)
                })

                tmpdata.map((item, index) => {
                    return item.id = index + 1
                })
                this.setState({
                    [record.id]: tmpdata,
                    tableSpin: false
                })
            }).catch(() => {
                message.error('未获取到订单')
                this.setState({
                    tableSpin: false
                })
            })
        } else {
            this.setState({
                [record.id]: [],
            })
        }
    }

    render() {
        const { columns, expandedRowRender, getOrder, getPrimary } = this
        const { pairData, spin } = this.state
        let page = {
            pageSize: 20
        }
        return (
            <div>
                <Button className={styles.but} onClick={getPrimary} type="primary">查询</Button>
                <Spin spinning={spin}>
                    <Table
                        columns={columns}
                        dataSource={pairData}
                        rowKey={record => record.id}
                        pagination={page}
                        expandedRowRender={expandedRowRender}
                        onExpand={getOrder}
                    />
                </Spin>
            </div>
        )
    }
}
