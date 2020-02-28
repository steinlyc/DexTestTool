import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import { menuMap, routerMap } from '../../Config'
import 'antd/dist/antd.css';
import styles from './home.module.css'

const { Sider } = Layout;
const { SubMenu, Item } = Menu;


class HoSider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menuTree: [],
            selectedNode: ''
        }
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if (
            nextProps.location.pathname !== '/' &&
            !!routerMap[nextProps.location.pathname] &&
            nextProps.location.pathname !== `/${nextState.selectedNode}`
        ) {
            this.menuCheck()
        }
    }

    componentDidMount() {
        const menuTreeNode = this.getMenu(menuMap)
        this.setState({
            menuTree: menuTreeNode,
        })
        this.menuCheck()
    }

    menuCheck() {
        const { pathname } = this.props.location
        const tmpTarget = [];
        if (routerMap[pathname]) {
            tmpTarget.push(routerMap[pathname].key)
        }
        this.setState({
            selectedNode: tmpTarget
        })
    }

    getMenu(data) {
        return data.map((item) => {
            if (item.hasChildren) {
                return (
                    <SubMenu
                        title={item.title}
                        key={item.name}
                    >
                        {this.getMenu(item.children)}
                    </SubMenu>
                )
            } else {
                return (
                    <Item key={item.name}>
                        <Link to={item.to}>
                            {item.title}
                        </Link>
                    </Item>
                )
            }
        })
    }

    render() {
        const { menuTree, selectedNode } = this.state
        return (
            <Sider className={styles.sider}>
                <div className={styles.logo} />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={selectedNode}
                    defaultOpenKeys={['abo', 'depth']}
                >
                    {menuTree}
                </Menu>
            </Sider>
        )
    }
}

export default withRouter(HoSider)