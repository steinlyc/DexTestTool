import React, { Component } from 'react'
import { Form, Button, Table, message, Spin, Radio, Select, Tabs } from 'antd';
import axios from 'axios'
import styles from './depmap.module.css'

const { Option } = Select
const { TabPane } = Tabs

class DepthMap extends Component {
    constructor(props) {
        super(props)
        this.getList = this.getList.bind(this)
        this.state = {
            exchange: "combine",
            data: "",
            localdate: "",
            dateList: "",
            selectTime: "",
            spin: false,
            beforeData: "",
            orderBuyData: "",
            orderSellData: "",
            afterData: "",
        }
        this.colBefore = [
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
                title: '共享前买累计',
                dataIndex: 'beforeBuyQua',
                key: 'beforeBuyQua',
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
                title: '共享前卖累计',
                dataIndex: 'beforeSellQua',
                key: 'beforeSellQua',
                align: 'center',
                render: text => <span>{text}</span>,
            },
        ]
        this.colOrderBuy = [
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
                title: '补单系数',
                dataIndex: 'orderBuyCoefficient',
                key: 'orderBuyCoefficient',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '累计买盘( x 系数)',
                dataIndex: 'orderBuyQua',
                key: 'orderBuyQua',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '补差价',
                dataIndex: 'orderBuyDifference',
                key: 'orderBuyDifference',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '分段',
                dataIndex: 'Sub',
                key: 'Sub',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '分段价格',
                dataIndex: 'orderBuySubPrice',
                key: 'orderBuySubPrice',
                align: 'center',
                render: text => <span>{text}</span>,
            },
        ]
        this.colOrderSell = [
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
                title: '补单系数',
                dataIndex: 'orderSellCoefficient',
                key: 'orderSellCoefficient',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '累计卖盘( x 系数)',
                dataIndex: 'orderSellQua',
                key: 'orderSellQua',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '补差价',
                dataIndex: 'orderSellDifference',
                key: 'orderSellDifference',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '分段',
                dataIndex: 'Sub',
                key: 'Sub',
                align: 'center',
                render: text => <span>{text}</span>,
            },
            {
                title: '分段价格',
                dataIndex: 'orderSellSubPrice',
                key: 'orderSellSubPrice',
                align: 'center',
                render: text => <span>{text}</span>,
            },
        ]
        this.colAfter = [
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
                title: '共享后买累计',
                dataIndex: 'afterBuyQua',
                key: 'afterBuyQua',
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
            },
            {
                title: '共享后卖累计',
                dataIndex: 'afterSellQua',
                key: 'afterSellQua',
                align: 'center',
                render: text => <span>{text}</span>,
            },
        ]
        this.setDate = this.setDate.bind(this)
    }

    componentDidMount() {
        let tempDate = new Date()
        this.setState(({
            localdate: tempDate.toJSON()
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
            this.setState(({
                data: tempData,
                spin: false
            }), this.tableData(tempData), this.tableOrderData(tempData))
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
            let timeList = res.data.data.find_depthdata
            let d1 = timeList.map((item) => {
                return item.datetime
            })
            timeList = [...new Set(d1)]
            let d2 = timeList.map((item) => {
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
                dateList: d2,
            })
        })
    }

    setDate(value) {
        this.setState({
            selectTime: value
        })
    }

    tableData(data) {
        let tempLength = []
        let tmpData1 = []
        let tmpData2 = []
        let sumq1 = []
        let sumq2 = []
        let tepBeforeData = []
        let tepafterData = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].beforeBuy !== '') {
                tmpData1.push(data[i].beforeBuy)
            }
            if (data[i].beforeSell !== '') {
                tmpData2.push(data[i].beforeSell)
            }
        }
        if (tmpData1.length === 1) {
            sumq1[0] = tmpData1[0]
        } else {
            for (let i = 1; i < tmpData1.length; i++) {
                sumq1[0] = tmpData1[0]
                sumq1[i] = (Number(tmpData1[i]) + Number(sumq1[i - 1])).toFixed(4)
            }
        }
        if (tmpData2.length === 1) {
            sumq2[0] = tmpData2[0]
        } else {
            for (let i = 1; i < tmpData2.length; i++) {
                sumq2[0] = tmpData2[0]
                sumq2[i] = (Number(tmpData2[i]) + Number(sumq2[i - 1])).toFixed(4)
            }
        }
        tempLength = tmpData1.length > tmpData2.length ? tmpData1.length : tmpData2.length
        for (let j = 0; j < tempLength; j++) {
            tepBeforeData[j] = {
                beforeBuy: data[j].beforeBuy,
                beforeSell: data[j].beforeSell,
                beforeBuyPrice: data[j].beforeBuyPrice,
                beforeSellPrice: data[j].beforeSellPrice,
                beforeBuyQua: sumq1[j],
                beforeSellQua: sumq2[j],
                id: j
            }
        }
        tmpData1 = []
        tmpData2 = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].afterBuy !== '') {
                tmpData1.push(data[i].afterBuy)
            }
            if (data[i].afterSell !== '') {
                tmpData2.push(data[i].afterSell)
            }
        }
        for (let i = 1; i < tmpData1.length; i++) {
            sumq1[0] = tmpData1[0]
            sumq1[i] = (Number(tmpData1[i]) + Number(sumq1[i - 1])).toFixed(4)
        }
        for (let i = 1; i < tmpData2.length; i++) {
            sumq2[0] = tmpData2[0]
            sumq2[i] = (Number(tmpData2[i]) + Number(sumq2[i - 1])).toFixed(4)
        }
        tempLength = tmpData1.length > tmpData2.length ? tmpData1.length : tmpData2.length
        for (let j = 0; j < tempLength; j++) {
            tepafterData[j] = {
                afterBuy: data[j].afterBuy,
                afterSell: data[j].afterSell,
                afterBuyPrice: data[j].afterBuyPrice,
                afterSellPrice: data[j].afterSellPrice,
                afterBuyQua: sumq1[j],
                afterSellQua: sumq2[j],
                id: j
            }
        }
        this.setState({
            beforeData: tepBeforeData,
            afterData: tepafterData
        })
    }

    tableOrderData(data) {
        let tepData1 = []
        let tepData2 = []
        let sumq1 = []
        let sumq2 = []
        let orderBuyData = []
        let orderSellData = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].orderBuy !== '') {
                tepData1.push(data[i].orderBuy)
            }
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].orderSell !== '') {
                tepData2.push(data[i].orderSell)
            }
        }
        switch (this.state.exchange) {
            case 'combine':
                for (let i = 1; i < tepData1.length; i++) {
                    sumq1[0] = tepData1[0]
                    sumq1[i] = (Number(tepData1[i]) + Number(sumq1[i - 1])).toFixed(4)
                }
                for (let j = 0; j < tepData1.length; j++) {
                    orderBuyData[j] = {
                        orderBuy: data[j].orderBuy,
                        orderBuyPrice: data[j].orderBuyPrice,
                        orderBuyCoefficient: 0,
                        orderBuyQua: sumq1[j],
                        orderBuyDifference: ((data[j].orderBuyPrice) / 0.97).toFixed(8),
                        Sub: (1 - (j + 1) / 100).toFixed(2),
                        orderBuySubPrice: (((data[j].orderBuyPrice) / 0.97) / (1 - (j + 1) / 100)).toFixed(8),
                        id: j
                    }
                }
                for (let i = 1; i < tepData2.length; i++) {
                    sumq2[0] = tepData2[0]
                    sumq2[i] = (Number(tepData2[i]) + Number(sumq2[i - 1])).toFixed(4)
                }
                for (let j = 0; j < tepData2.length; j++) {
                    orderSellData[j] = {
                        orderSell: data[j].orderSell,
                        orderSellPrice: data[j].orderSellPrice,
                        orderSellCoefficient: 0,
                        orderSellQua: sumq2[j],
                        orderSellDifference: ((data[j].orderSellPrice) / 0.97).toFixed(8),
                        Sub: (1 - (j + 1) / 100).toFixed(2),
                        orderSellSubPrice: (((data[j].orderSellPrice) / 0.97) / (1 - (j + 1) / 100)).toFixed(8),
                        id: j
                    }
                }
                break;
            case 'aex':
                for (let i = 1; i < tepData1.length; i++) {
                    sumq1[0] = (tepData1[0] * (0.02)).toFixed(4)
                    sumq1[i] = (Number(tepData1[i]) * (0.02) + Number(sumq1[i - 1])).toFixed(4)
                }
                for (let j = 0; j < tepData1.length; j++) {
                    orderBuyData[j] = {
                        orderBuy: data[j].orderBuy,
                        orderBuyPrice: data[j].orderBuyPrice,
                        orderBuyCoefficient: 0.02,
                        orderBuyQua: sumq1[j],
                        orderBuyDifference: ((data[j].orderBuyPrice) / 0.97).toFixed(8),
                        Sub: (1 - (j + 1) / 100).toFixed(2),
                        orderBuySubPrice: (((data[j].orderBuyPrice) / 0.97) / (1 - (j + 1) / 100)).toFixed(8),
                        id: j
                    }
                }
                for (let i = 1; i < tepData2.length; i++) {
                    sumq2[0] = (tepData2[0] * (0.02)).toFixed(4)
                    sumq2[i] = (Number(tepData2[i]) * (0.02) + Number(sumq2[i - 1])).toFixed(4)
                }
                for (let j = 0; j < tepData2.length; j++) {
                    orderSellData[j] = {
                        orderSell: data[j].orderSell,
                        orderSellPrice: data[j].orderSellPrice,
                        orderSellCoefficient: 0.02,
                        orderSellQua: sumq2[j],
                        orderSellDifference: ((data[j].orderSellPrice) / 0.97).toFixed(8),
                        Sub: (1 - (j + 1) / 100).toFixed(2),
                        orderSellSubPrice: (((data[j].orderSellPrice) / 0.97) / (1 - (j + 1) / 100)).toFixed(8),
                        id: j
                    }
                }
                break;
            case 'cointiger':
                for (let i = 1; i < tepData1.length; i++) {
                    sumq1[0] = (tepData1[0] * (0.08)).toFixed(4)
                    sumq1[i] = (Number(tepData1[i]) * (0.08) + Number(sumq1[i - 1])).toFixed(4)
                }
                for (let j = 0; j < tepData1.length; j++) {
                    orderBuyData[j] = {
                        orderBuy: data[j].orderBuy,
                        orderBuyPrice: data[j].orderBuyPrice,
                        orderBuyCoefficient: 0.08,
                        orderBuyQua: sumq1[j],
                        orderBuyDifference: ((data[j].orderBuyPrice) / 0.97).toFixed(8),
                        Sub: (1 - (j + 1) / 100).toFixed(2),
                        orderBuySubPrice: (((data[j].orderBuyPrice) / 0.97) / (1 - (j + 1) / 100)).toFixed(8),
                        id: j
                    }
                }
                for (let i = 1; i < tepData2.length; i++) {
                    sumq2[0] = (tepData2[0] * (0.08)).toFixed(4)
                    sumq2[i] = (Number(tepData2[i]) * (0.08) + Number(sumq2[i - 1])).toFixed(4)
                }
                for (let j = 0; j < tepData2.length; j++) {
                    orderSellData[j] = {
                        orderSell: data[j].orderSell,
                        orderSellPrice: data[j].orderSellPrice,
                        orderSellCoefficient: 0.08,
                        orderSellQua: sumq2[j],
                        orderSellDifference: ((data[j].orderSellPrice) / 0.97).toFixed(8),
                        Sub: (1 - (j + 1) / 100).toFixed(2),
                        orderSellSubPrice: (((data[j].orderSellPrice) / 0.97) / (1 - (j + 1) / 100)).toFixed(8),
                        id: j
                    }
                }
                break;
            case 'lbank':
                for (let i = 1; i < tepData1.length; i++) {
                    sumq1[0] = (tepData1[0] * (0.08)).toFixed(4)
                    sumq1[i] = (Number(tepData1[i]) * (0.08) + Number(sumq1[i - 1])).toFixed(4)
                }
                for (let j = 0; j < tepData1.length; j++) {
                    orderBuyData[j] = {
                        orderBuy: data[j].orderBuy,
                        orderBuyPrice: data[j].orderBuyPrice,
                        orderBuyCoefficient: 0.08,
                        orderBuyQua: sumq1[j],
                        orderBuyDifference: ((data[j].orderBuyPrice) / 0.97).toFixed(8),
                        Sub: (1 - (j + 1) / 100).toFixed(2),
                        orderBuySubPrice: (((data[j].orderBuyPrice) / 0.97) / (1 - (j + 1) / 100)).toFixed(8),
                        id: j
                    }
                }
                for (let i = 1; i < tepData2.length; i++) {
                    sumq2[0] = (tepData2[0] * (0.08)).toFixed(4)
                    sumq2[i] = (Number(tepData2[i]) * (0.08) + Number(sumq2[i - 1])).toFixed(4)
                }
                for (let j = 0; j < tepData2.length; j++) {
                    orderSellData[j] = {
                        orderSell: data[j].orderSell,
                        orderSellPrice: data[j].orderSellPrice,
                        orderSellCoefficient: 0.08,
                        orderSellQua: sumq2[j],
                        orderSellDifference: ((data[j].orderSellPrice) / 0.97).toFixed(8),
                        Sub: (1 - (j + 1) / 100).toFixed(2),
                        orderSellSubPrice: (((data[j].orderSellPrice) / 0.97) / (1 - (j + 1) / 100)).toFixed(8),
                        id: j
                    }
                }
                break;
            case 'dex':
                for (let i = 1; i < tepData1.length; i++) {
                    sumq1[0] = tepData1[0]
                    sumq1[i] = (Number(tepData1[i]) + Number(sumq1[i - 1])).toFixed(4)
                }
                for (let j = 0; j < tepData1.length; j++) {
                    orderBuyData[j] = {
                        orderBuy: data[j].orderBuy,
                        orderBuyPrice: data[j].orderBuyPrice,
                        orderBuyCoefficient: 0,
                        orderBuyQua: sumq1[j],
                        orderBuyDifference: ((data[j].orderBuyPrice) / 0.97).toFixed(8),
                        Sub: (1 - (j + 1) / 100).toFixed(2),
                        orderBuySubPrice: (((data[j].orderBuyPrice) / 0.97) / (1 - (j + 1) / 100)).toFixed(8),
                        id: j
                    }
                }
                for (let i = 1; i < tepData2.length; i++) {
                    sumq2[0] = tepData2[0]
                    sumq2[i] = (Number(tepData2[i]) + Number(sumq2[i - 1])).toFixed(4)
                }
                for (let j = 0; j < tepData2.length; j++) {
                    orderSellData[j] = {
                        orderSell: data[j].orderSell,
                        orderSellPrice: data[j].orderSellPrice,
                        orderSellCoefficient: 0,
                        orderSellQua: sumq2[j],
                        orderSellDifference: ((data[j].orderSellPrice) / 0.97).toFixed(8),
                        Sub: (1 - (j + 1) / 100).toFixed(2),
                        orderSellSubPrice: (((data[j].orderSellPrice) / 0.97) / (1 - (j + 1) / 100)).toFixed(8),
                        id: j
                    }
                }
                break;
            default:
                break;
        }
        this.setState({
            orderBuyData: orderBuyData,
            orderSellData: orderSellData
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
        const { spin, dateList, beforeData, orderBuyData, orderSellData, afterData } = this.state
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
                        <Tabs defaultActiveKey="1" >
                            <TabPane tab="共享前" key="1">
                                <Table
                                    columns={this.colBefore}
                                    dataSource={beforeData}
                                    rowKey={record => record.id}
                                    pagination={false}
                                    className={styles.depthData}
                                />
                            </TabPane>
                            <TabPane tab="目标共享买" key="2">
                                <Table
                                    columns={this.colOrderBuy}
                                    dataSource={orderBuyData}
                                    rowKey={record => record.id}
                                    pagination={false}
                                    className={styles.depthData}
                                />
                            </TabPane>
                            <TabPane tab="目标共享卖" key="3">
                                <Table
                                    columns={this.colOrderSell}
                                    dataSource={orderSellData}
                                    rowKey={record => record.id}
                                    pagination={false}
                                    className={styles.depthData}
                                />
                            </TabPane>
                            <TabPane tab="共享后" key="4">
                                <Table
                                    columns={this.colAfter}
                                    dataSource={afterData}
                                    rowKey={record => record.id}
                                    pagination={false}
                                    className={styles.depthData}
                                />
                            </TabPane>
                        </Tabs>
                    </Form>
                </div>
            </Spin>
        )
    }
}

const GetDepthMap = Form.create({ name: 'get_depthMap' })(DepthMap);
export default GetDepthMap