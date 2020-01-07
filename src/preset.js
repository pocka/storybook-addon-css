const styleFileExts = ['css', 'sass', 'scss', 'less']

const isStyleRule = ({ test }) => {
  const testFilenames = styleFileExts.map(ext => `a.${ext}`)

  if (test instanceof RegExp) {
    return testFilenames.some(filename => test.test(filename))
  }

  // We can't guess the rule is for style file.
  if (typeof test === 'string') {
    return false
  }

  if (typeof test === 'function') {
    return testFilenames.some(filename => test(filename))
  }

  // Ignore complex conditions :p
  return false
}

const STYLE_LOADER = require.resolve('style-loader')

const hasInjectTypeOptions = require('style-loader/package.json').version.match(
  /1\.\d+\.\d/
)

const hasStyleLoader = rule => {
  if (rule.loader) {
    return rule.loader === STYLE_LOADER
  }

  return rule.use.some(use => {
    if (typeof use === 'string') {
      return use === STYLE_LOADER
    }

    return use.loader === STYLE_LOADER
  })
}

const injectStoryStyleLoader = rule => {
  return {
    test: rule.test,
    oneOf: [
      {
        ...rule,
        resourceQuery: /story/,
        test: void 0,
        loader: void 0,
        query: void 0,
        options: void 0,
        use: rule.loader
          ? [
              hasInjectTypeOptions
                ? {
                    loader: 'style-loader',
                    options: {
                      ...(rule.options || rule.query),
                      injectType: 'lazyStyleTag'
                    }
                  }
                : {
                    ...rule,
                    loader: 'style-loader/useable'
                  }
            ]
          : rule.use.map(use => {
              if (
                !(
                  (typeof use === 'string' && use === STYLE_LOADER) ||
                  use.loader === STYLE_LOADER
                )
              ) {
                return use
              }

              if (typeof use === 'string') {
                return hasInjectTypeOptions
                  ? {
                      loader: STYLE_LOADER,
                      options: {
                        injectType: 'lazyStyleTag'
                      }
                    }
                  : 'style-loader/useable'
              }

              return hasInjectTypeOptions
                ? {
                    ...use,
                    options: {
                      ...use.options,
                      injectType: 'lazyStyleTag'
                    }
                  }
                : {
                    ...use,
                    loader: 'style-loader/useable'
                  }
            })
      },
      {
        ...rule,
        test: void 0
      }
    ]
  }
}

function webpackFinal(config) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: config.module.rules.map(rule => {
        if (!isStyleRule(rule) || !hasStyleLoader(rule)) {
          return rule
        }

        return injectStoryStyleLoader(rule)
      })
    }
  }
}

module.exports = { webpackFinal }
