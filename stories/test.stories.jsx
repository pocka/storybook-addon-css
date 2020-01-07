import React from 'react'

export default {
  title: 'Test'
}

export const foo = () => <div>Foo</div>

foo.story = {
  parameters: {
    styles: [import('./foo.css?story')]
  }
}

export const bar = () => <div>Bar</div>

bar.story = {
  parameters: {
    styles: [import('./bar.css?story')]
  }
}
