import React, { Component } from 'react'
import PropsRoute from '../../components/PropsRoute'
import Abo from '../abo'
import YearProfit from '../year-profit'
import DepthData from '../depth-data'
import DepthMap from '../depth-map'
import PairPrice from '../pair-price'
import BuyBack from '../buy-back'
import Order from '../order'

export default class HoRouter extends Component {
    render() {
        return (
            <div>
                <PropsRoute
                    exact
                    path="/"
                    component={Abo} />
                <PropsRoute
                    exact
                    path="/abo1"
                    component={Abo} />
                <PropsRoute
                    exact
                    path="/abo2"
                    component={YearProfit} />
                <PropsRoute
                    exact
                    path="/abo3"
                    component={BuyBack} />
                <PropsRoute
                    exact
                    path="/abo4"
                    component={Order} />
                    <PropsRoute
                    exact
                    path="/abo5"
                    component={PairPrice} />
                <PropsRoute
                    exact
                    path="/depth1"
                    component={DepthData} />
                <PropsRoute
                    exact
                    path="/depth2"
                    component={DepthMap} />
            </div>
        )
    }
}
