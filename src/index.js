import addons, { makeDecorator } from '@storybook/addons'
import { STORY_CHANGED } from '@storybook/core-events'

export default makeDecorator({
  name: 'withStyles',
  parameterName: 'styles',
  skipIfNoParametersOrOptions: true,
  wrapper(getStory, context, { parameters }) {
    const channel = addons.getChannel()

    // Make everything promise so that user can use both dynamic import
    // and `require` method.
    const modules = parameters.map(mod =>
      mod instanceof Promise ? mod : Promise.resolve(mod)
    )

    // Apply all styles listed in `styles` parameter.
    modules.map(promise => {
      promise.then(mod => {
        // There is no `use` and `unuse` methods when importing style without
        // lazyStyleTag(or lazySingletonStyleTag) or style-loader/useable.
        if (typeof mod.use !== 'function') {
          console.warn(
            'Cannot import `use` method from style module.' +
              'Make sure to add `?story` query to import statement.'
          )
          return
        }

        mod.use()
      })
    })

    // Remove all styles when leaving the story.
    channel.once(STORY_CHANGED, () => {
      modules.map(promise => {
        promise.then(mod => {
          if (typeof mod.unuse !== 'function') {
            return
          }

          mod.unuse()
        })
      })
    })

    return getStory(context)
  }
})
