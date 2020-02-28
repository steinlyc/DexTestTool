import React, { Component } from 'react'
import styles from './buyback.module.css'
import axios from 'axios'
import BackTable from './buybackTable'
import { Descriptions, Badge, Button } from 'antd';

let monitor = null

export default class BuyBack extends Component {
    constructor(props) {
        super(props)
        this.state = {
            blockinfo: '',
            blocktime: '',
            show: false,
            status: '',
            loading: false,
        }
    }

    componentDidMount() {
        this.check()
    }

    componentWillUnmount() {
        clearInterval(monitor)
    }

    uaxios(url, schema) {
        try {
            const result = axios({
                method: 'GET',
                url,
                withCredentials: true,
                headers: {
                    'Content-Type': 'text/html; charset=utf8',
                },
                params: schema,
            })
            return result
        } catch (err) {
            throw err
        }
    }

    check = () => {
        const url = 'http://api.fowallet.net/1.0/app/blocks'
        const schema = {
            order: '-id'
        }
        this.uaxios(url, schema).then((res) => {
            const localtime = new Date()
            const timedata = res.data[0].block_time;
            const tmptime = new Date(timedata)
            const now = localtime.getTime(), before = tmptime.getTime();
            const differ = (now - before) / 1000 / 60 / 60
            // tmptime.setHours(tmptime.getHours() + 8)
            if (differ >= 1) {
                if (window.Notification && Notification.permission !== "denied") {
                    Notification.requestPermission(() => {
                        new Notification('节点异常');
                    });
                }
                this.setState({
                    status: false
                })
            } else {
                this.setState({
                    status: true
                })
            }
            this.setState({
                blockinfo: res.data[0],
                blocktime: tmptime.toLocaleString('chinese', { hour12: false }),
                show: true,
            })
        })
    }

    polling = () => {
        clearInterval(monitor)
        monitor = setInterval(() => {
            this.check()
        }, 60000)
        this.setState({
            loading: true
        })
    }

    stop = () => {
        clearInterval(monitor)
        this.setState({
            loading: false
        })
    }

    render() {
        const { blockinfo, blocktime, status, show, loading } = this.state
        const { Item } = Descriptions
        return (
            <div className={styles.main}>
                <div className={styles.but}>
                    <Button type="primary" className={styles.search} onClick={this.check}>查询节点信息</Button>
                    <Button
                        type="primary"
                        className={styles.search}
                        onClick={this.polling}
                        loading={loading}
                    >
                        {loading ? "监控中" : "启动监控节点"}
                    </Button>
                    <Button type="primary" className={styles.search} onClick={this.stop}>结束监控节点</Button>
                </div>
                <Descriptions title="当前节点最新区块信息" bordered style={show ? { display: 'block' } : { display: 'none' }}>
                    <Item label="节点运行状态" span={3} >
                        <Badge
                            status={status ? "success" : "error"}
                            text={status ? "节点运行正常" : "节点运行异常"}
                            style={status ? { color: 'rgba(0, 0, 0, 0.65)' } : { color: 'red' }}
                        />
                    </Item>
                    <Item label="区块编号">
                        {blockinfo.block_num}
                    </Item>
                    <Item label="区块ID">
                        {blockinfo.id}
                    </Item>
                    <Item label="区块状态">
                        {blockinfo.status}
                    </Item>
                    <Item label="区块时间">
                        {blocktime}
                    </Item>
                    <Item label="创建时间">
                        {new Date(blockinfo.createdAt).toLocaleString('chinese', { hour12: false })}
                    </Item>
                    <Item label="更新时间">
                        {new Date(blockinfo.updatedAt).toLocaleString('chinese', { hour12: false })}
                    </Item>
                    <Item label="创建者">
                        {blockinfo.producer}
                    </Item>
                    <Item label="创建者区块ID" span={2}>
                        {blockinfo.producer_block_id}
                    </Item>
                    <Item label="Previous" span={3}>
                        {blockinfo.previous}
                    </Item>
                </Descriptions>
                <BackTable />
            </div>
        )
    }
}
