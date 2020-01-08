import React from 'react'

export default {
  title: 'Test',
  parameters: {
    styles: [import('./foo.css?story')]
  }
}

export const foo = () => <div>Foo</div>

export const bar = () => <div>Bar</div>

bar.story = {
  parameters: {
    styles: [import('./bar.css?story')]
  }
}

export const baz = () => <div>Baz</div>
