import * as React from 'react'

import { Route } from 'react-router-dom'

const PropsRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => <Component {...props} />}
    />
)
export default PropsRoute
