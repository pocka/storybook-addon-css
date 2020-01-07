import addons, { makeDecorator } from '@storybook/addons'
import { STORY_CHANGED, STORY_RENDERED } from '@storybook/core-events'

export default makeDecorator({
  name: 'withStyles',
  parameterName: 'styles',
  skipIfNoParametersOrOptions: true,
  wrapper(getStory, context, { parameters }) {
    const channel = addons.getChannel()

    channel.once(STORY_RENDERED, () => {
      parameters.map(promise => {
        promise.then(mod => {
          mod.use()
        })
      })
    })

    channel.once(STORY_CHANGED, () => {
      parameters.map(promise => {
        promise.then(mod => {
          mod.unuse()
        })
      })
    })

    return getStory(context)
  }
})
