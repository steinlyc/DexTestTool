import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import styles from './profit.module.css'

class YearProfit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            presentValue: null
        }

    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState(
                    ({
                        data: values
                    }),
                    this.getPresentValue)
            }
        });
    };

    getPresentValue() {
        const { data } = this.state
        let prodQuan = Number(data.prodQuan)
        let profit = Number(data.profit)
        let dayProfit = profit / prodQuan
        let result = Number(data.result) / 100
        let residual = Number(data.residual)
        let duration = Number(data.duration)
        let sum = 0;
        for (let i = 1; i <= duration; i++) {
            sum += dayProfit / Math.pow(1 + result, i / 365);
        }
        sum += residual / Math.pow(1 + result, duration / 365)
        this.setState({
            presentValue: '产品现值约等于' + sum
        })
    }

    render() {
        const { presentValue } = this.state
        const { getFieldDecorator } = this.props.form;
        const { Item } = Form
        return (
            <div className={styles.profitPage}>
                <Form onSubmit={this.handleSubmit}>
                    <Item>
                        {getFieldDecorator('profit', {
                            rules: [{ required: true, message: '请输入7日日均收益' }],
                        })(
                            <div className={styles.profitDiv}>
                                <label htmlFor="profit" className={styles.profitLab}>7日日均收益</label>
                                <Input
                                    id="profit"
                                    placeholder="请输入7日日均收益"
                                    className={styles.profitIpt}
                                />
                            </div>

                        )}
                    </Item>
                    <Item>
                        {getFieldDecorator('prodQuan', {
                            rules: [{ required: true, message: '请输入产品数量' }],
                        })(
                            <div className={styles.profitDiv}>
                                <label htmlFor="prodQuan" className={styles.profitLab}>产品数量：</label>
                                <Input
                                    id="prodQuan"
                                    placeholder="请输入产品数量"
                                    className={styles.profitIpt}
                                />
                            </div>

                        )}
                    </Item>
                    <Item>
                        {getFieldDecorator('result', {
                            rules: [{ required: true, message: '请输入预期年化收益：' }],
                        })(
                            <div className={styles.profitDiv}>
                                <label htmlFor="result" className={styles.profitLab}>预期年化：</label>
                                <Input
                                    id="result"
                                    placeholder="请输入预期年化收益："
                                    className={styles.profitIpt}
                                />
                            </div>

                        )}
                    </Item>
                    <Item>
                        {getFieldDecorator('residual', {
                            rules: [{ required: true, message: '请输入预期残值' }],
                        })(
                            <div className={styles.profitDiv}>
                                <label htmlFor="residual" className={styles.profitLab}>预期残值：</label>
                                <Input
                                    id="residual"
                                    placeholder="请输入预期残值"
                                    className={styles.profitIpt}
                                />
                            </div>

                        )}
                    </Item>
                    <Item>
                        {getFieldDecorator('duration', {
                            rules: [{ required: true, message: '请输入剩余时间' }],
                        })(
                            <div className={styles.profitDiv}>
                                <label htmlFor="duration" className={styles.profitLab}>剩余时间：</label>
                                <Input
                                    id="duration"
                                    placeholder="请输入剩余时间"
                                    className={styles.profitIpt}
                                />
                            </div>

                        )}
                    </Item>
                    <Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={styles.depthButton}
                        >
                            计算现值
                    </Button>
                    </Item>
                    <div className={styles.yearProfit}>
                        <span id="yearProfit">{presentValue}</span>
                    </div >
                </Form>
            </div >
        )
    }
}

const yearProfit = Form.create({ name: 'year_Profit' })(YearProfit);
export default yearProfit