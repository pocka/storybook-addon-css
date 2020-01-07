import { addDecorator, configure } from '@storybook/react'

import withStyles from '../src'

addDecorator(withStyles)

configure(require.context('../stories', true, /\.stories.jsx?$/), module)
