import React, { Component } from 'react'
import axios from 'axios'
import styles from './pairprice.module.css'

let setTime = null;

export default class Buyback extends Component {
    constructor(props) {
        super(props)
        this.getRes = this.getRes.bind(this)
        this.state = {
            price: '',
        }
    }

    componentWillUnmount() {
        clearInterval(setTime)
    }

    uaxios(url, schema) {
        try {
            const result = axios({
                method: 'GET',
                url,
                withCredentials: true,
                headers: {
                    'Content-Type': 'text/html;charset=utf-8',
                },
                params: schema,
            })
            return result
        } catch (err) {
            throw err
        }
    }

    getRes() {
        clearInterval(setTime)
        const url = '/httpAPIv2.php';
        const schema = {
            isAll: true
        }
        setTime = setInterval(() => {
            this.uaxios(url, schema).then((res) => {
                let tempPrice = res.data.eos2cnc
                this.setState(({
                    price: res.data.eos2cnc
                }), this.check(tempPrice))
            }).catch((err) => {
                console.log(err)
            })
        }, 5000);
    }

    check(tempPrice) {
        const value = this.input.value
        if (tempPrice <= `${value}`) {
            if (window.Notification && Notification.permission !== "denied") {
                Notification.requestPermission(() => {
                    new Notification('EOS价格', { body: `${tempPrice}` });
                });
            }
        }
    }

    stop() {
        clearInterval(setTime)
    }

    render() {
        return (
            <div className={styles.maindiv}>
                <input className={styles.inpPrice} ref={input => this.input = input} placeholder="请输入预期价格" />
                <button className={styles.startBut} onClick={this.getRes}>开始监控价格</button>
                <button className={styles.stopBut} onClick={this.stop}>停止监控价格</button>
                <div className={styles.info}>当前EOS → CNC价格：{this.state.price}</div>
            </div>
        )
    }
}
