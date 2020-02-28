import React, { Component } from 'react'
import { Form, Input, Button, Table, message, Spin } from 'antd';
import axios from 'axios'
import styles from './abo.module.css'

class DepthMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tokenPair: {},
            depthMap: [],
            spin: false
        }
        this.columns = [
            {
                title: '买盘价格',
                dataIndex: 'buy_price',
                key: 'buy_price',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '买盘数量',
                dataIndex: 'buy_sum_quantity',
                key: 'buy_sum_quantity',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '卖盘价格',
                dataIndex: 'sell_price',
                key: 'sell_price',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '卖盘数量',
                dataIndex: 'sell_sum_quantity',
                key: 'sell_sum_quantity',
                align: 'center',
                render: text => <span>{text}</span>,
            }
        ]
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState(
                    ({
                        tokenPair: values
                    }),
                    this.getPair)
            }
        })
    }

    uaxios(url, schema) {
        try {
            const result = axios({
                method: 'POST',
                url,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: schema,
            })
            return result
        } catch (err) {
            throw err
        }
    }

    getPair() {
        this.setState({
            spin: true
        })
        const tokenX = this.state.tokenPair.TokenX;
        const tokenY = this.state.tokenPair.TokenY;
        const schema = `{"tokenx":"${tokenX}","tokeny":"${tokenY}","limit":24}`
        const url = 'https://api.fowallet.net/1.0/app/order/getDepthmap'
        this.uaxios(url, schema).then(res => {
            let depthMapTemp = [];
            for (let i = 0; i < res.data.buy.length; i++) {
                depthMapTemp[i] = {
                    buy_sum_quantity: res.data.buy[i].sum_quantity,
                    sell_sum_quantity: res.data.sell[i].sum_quantity,
                    buy_price: res.data.buy[i].price,
                    sell_price: res.data.sell[i].price,
                    id: i
                }
            }
            this.setState({
                depthMap: depthMapTemp,
                spin: false
            })
        }).catch(() => {
            message.error('未找到交易对')
            this.setState({
                spin: false
            })
        }
        )
    }

    render() {
        const { Item } = Form
        const { spin } = this.state
        const { getFieldDecorator } = this.props.form;
        const pagination = {
            defaultPageSize: 24
        }
        return (
            <Spin spinning={spin}>
                <div className={styles.depthPage}>
                    <Form onSubmit={this.handleSubmit}>
                        <Item>
                            {getFieldDecorator('TokenX', {
                                rules: [{ required: true, message: '请输入TokenX' }],
                            })(
                                <div>
                                    <label htmlFor="tokenx" className={styles.depthLabel}>Token-x：</label>
                                    <Input
                                        id="tokenx"
                                        className={styles.depthInp}
                                        placeholder="请输入TokenX" />
                                </div>

                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('TokenY', {
                                rules: [{ required: true, message: '请输入TokenY' }],
                            })(
                                <div>
                                    <label htmlFor="tokeny" className={styles.depthLabel}>Token-y：</label>
                                    <Input
                                        id="tokeny"
                                        className={styles.depthInp}
                                        placeholder="请输入TokenY" />
                                </div>
                            )}
                        </Item>
                        <Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className={styles.depthButton}
                            >
                                获取盘口
                    </Button>
                        </Item>
                    </Form>
                    <Table
                        columns={this.columns}
                        dataSource={this.state.depthMap}
                        pagination={pagination}
                        rowKey={record => record.id}
                    />
                </div>
            </Spin>
        );
    }
}

const UniSwapDepthMap = Form.create({ name: 'get_depthMap' })(DepthMap);
export default UniSwapDepthMap