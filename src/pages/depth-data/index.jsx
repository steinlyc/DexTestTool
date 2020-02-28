import React, { Component } from 'react'
import { Form, Button, Table, message, Spin, Radio, Select } from 'antd';
import axios from 'axios'
import styles from './depdata.module.css'

const { Option } = Select

class DepthData extends Component {
    constructor(props) {
        super(props)
        this.getList = this.getList.bind(this)
        this.state = {
            exchange: "combine",
            data: null,
            localdate: "",
            dateList: "",
            selectTime: "",
            spin: false,
        }
        this.columns = [
            {
                title: '共享前买价格',
                dataIndex: 'beforeBuyPrice',
                key: 'beforeBuyPrice',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '共享前买盘',
                dataIndex: 'beforeBuy',
                key: 'beforeBuy',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '共享前卖价格',
                dataIndex: 'beforeSellPrice',
                key: 'beforeSellPrice',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '共享前卖盘',
                dataIndex: 'beforeSell',
                key: 'beforeSell',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '目标买价格',
                dataIndex: 'orderBuyPrice',
                key: 'orderBuyPrice',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '目标买盘',
                dataIndex: 'orderBuy',
                key: 'orderBuy',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '目标卖价格',
                dataIndex: 'orderSellPrice',
                key: 'orderSellPrice',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '目标卖盘',
                dataIndex: 'orderSell',
                key: 'orderSell',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '共享后买价格',
                dataIndex: 'afterBuyPrice',
                key: 'afterBuyPrice',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '共享后买盘',
                dataIndex: 'afterBuy',
                key: 'afterBuy',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '共享后卖价格',
                dataIndex: 'afterSellPrice',
                key: 'afterSellPrice',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '共享后卖盘',
                dataIndex: 'afterSell',
                key: 'afterSell',
                align: 'center',
                render: text => <span>{text}</span>,
            }
        ]
        this.setDate = this.setDate.bind(this)
    }

    componentDidMount() {
        let tempdata = new Date()
        this.setState(({
            localdate: tempdata.toJSON()
        }), this.getDateTime)
    }

    uaxios(url, schema) {
        try {
            const result = axios({
                method: 'POST',
                url,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/graphql',
                },
                data: schema,
            })
            return result
        } catch (err) {
            throw err
        }
    }
    getList() {
        let { exchange, selectTime } = this.state
        const url = '/1.0/app'
        const schema = `{
            find_depthdata(
             where:{
                datetime: "${selectTime}"
                type: {
                    in: ["aftereat", "final"]
                }
                or: [
                {
                    k: "all"
                },
                {
                    k: "${exchange}"
                }
            ]
             }
            ){
              k,
              v,
              datetime
              type
            }
          }`
        this.uaxios(url, schema).then((res) => {
            let tempData = [];
            let length = [];
            let resp = res.data.data;
            for (let i = 0; i < 3; i++) {
                length.push(resp.find_depthdata[i].v.asks.length)
                length.push(resp.find_depthdata[i].v.bids.length)
            }
            let maxLength = length.sort(function (a, b) {
                return b - a
            })
            for (let i = 0; i < maxLength[0]; i++) {
                tempData[i] = {
                    beforeBuy: resp.find_depthdata[0].v.bids[i] ? resp.find_depthdata[0].v.bids[i][1] : '',
                    beforeSell: resp.find_depthdata[0].v.asks[i] ? resp.find_depthdata[0].v.asks[i][1] : '',
                    orderBuy: resp.find_depthdata[2].v.bids[i] ? resp.find_depthdata[2].v.bids[i][1] : '',
                    orderSell: resp.find_depthdata[2].v.asks[i] ? resp.find_depthdata[2].v.asks[i][1] : '',
                    afterBuy: resp.find_depthdata[1].v.bids[i] ? resp.find_depthdata[1].v.bids[i][1] : '',
                    afterSell: resp.find_depthdata[1].v.asks[i] ? resp.find_depthdata[1].v.asks[i][1] : '',
                    beforeBuyPrice: resp.find_depthdata[0].v.bids[i] ? resp.find_depthdata[0].v.bids[i][0] : '',
                    beforeSellPrice: resp.find_depthdata[0].v.asks[i] ? resp.find_depthdata[0].v.asks[i][0] : '',
                    orderBuyPrice: resp.find_depthdata[2].v.bids[i] ? resp.find_depthdata[2].v.bids[i][0] : '',
                    orderSellPrice: resp.find_depthdata[2].v.asks[i] ? resp.find_depthdata[2].v.asks[i][0] : '',
                    afterBuyPrice: resp.find_depthdata[1].v.bids[i] ? resp.find_depthdata[1].v.bids[i][0] : '',
                    afterSellPrice: resp.find_depthdata[1].v.asks[i] ? resp.find_depthdata[1].v.asks[i][0] : '',
                    id: i
                }
            }
            this.setState({
                data: tempData,
                spin: false
            })
        }).catch(() => {
            message.error('未获取数据')
            this.setState({
                spin: false
            })
        })
    }

    getDateTime() {
        let { localdate } = this.state
        const url = '/1.0/app'
        const schema = `{
            find_depthdata(
                order: "-createdAt"
             where:{
               k: "cointiger"
               type: "origin"

          datetime: {
              lte: "${localdate}"
          }

             }
            ){
              datetime
            }
          }`
        this.uaxios(url, schema).then((res) => {
            let tmpdata = res.data.data.find_depthdata
            let tmptime = tmpdata.map((item) => {
                return item.datetime
            })
            tmpdata = [...new Set(tmptime)]
            let timelist = tmpdata.map((item) => {
                return (
                    <Option
                        value={item}
                        key={item}
                    >
                        {new Date(item).toLocaleString()}
                    </Option>
                )
            })
            this.setState({
                dateList: timelist,
            })
        })
    }

    setDate(value) {
        this.setState({
            selectTime: value
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.getList()
                this.setState({
                    spin: true
                })
            }
        });
    };

    radioChange = (e) => {
        this.setState({
            exchange: e.target.value
        })
    }

    render() {
        const { spin, dateList, data } = this.state
        const { getFieldDecorator } = this.props.form;
        return (
            <Spin spinning={spin}>
                <div className={styles.dataPage}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item>
                            <Radio.Group
                                name="radiogroup"
                                defaultValue={"combine"}
                                onChange={this.radioChange}
                                className={styles.exchangeRao}
                            >
                                <Radio value={"combine"}>全网</Radio>
                                <Radio value={"aex"}>AEX</Radio>
                                <Radio value={"cointiger"}>CT</Radio>
                                <Radio value={"lbank"}>Lbank</Radio>
                                <Radio value={"dex"}>DEX</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className={styles.depthButton}
                            >
                                获取盘口
                            </Button>
                        </Form.Item>
                        <Form.Item className={styles.selectDate}>
                            {getFieldDecorator('selectTime', {
                                rules: [{ required: true, message: '请选择时间' }],
                            })(
                                <Select
                                    onChange={this.setDate}
                                >
                                    {dateList}
                                </Select>

                            )}
                        </Form.Item>
                        <Table
                            columns={this.columns}
                            dataSource={data}
                            rowKey={record => record.id}
                            pagination={false}
                            className={styles.depthData}
                        />
                    </Form>
                </div>
            </Spin>
        )
    }
}

const GetDepthData = Form.create({ name: 'get_depthData' })(DepthData);
export default GetDepthData