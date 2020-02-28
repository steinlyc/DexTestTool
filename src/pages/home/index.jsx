import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import styles from './home.module.css';
import store from '../../store';
import HoSider from './index.sider'
import HoRouter from './index.router';

const { Content, Footer } = Layout;

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Layout>
          <Router>
            <HoSider />
            <Layout className={styles.Rlayout}>
              <Content className={styles.content}>
                <HoRouter />
              </Content>
              <Footer className={styles.footer}>D3J Test Tools</Footer>
            </Layout>
          </Router>
        </Layout>
      </Provider>
    )
  }
}