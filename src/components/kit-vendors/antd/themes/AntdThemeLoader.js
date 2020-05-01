/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

// const preProcessor = ClassConstructor => class _PreProcessor extends ClassConstructor {
//   constructor(options) {
//     super(options)
//     this.options = options
//     this.options.replacement = options.replacement || []
//     this.less = options.less
//   }

//   process(css) {
//     return css
//   }
// }

// original code: https://github.com/atvilelas/antd-theming-engine/blob/master/PostImportPrefixCleanUp.js
const postProcessor = ClassConstructor => class _PostProcessor extends ClassConstructor {
  constructor(options) {
    super(options)
    this.options = options
    this.options.wrappers = options.wrappers || []
    this.less = options.less
  }

  process(css) {
    // Check if css is wrapped with any one of the marks
    const antDesignTemplateMark = this.options.wrappers.reduce((mark, wrapper) => (css.indexOf(wrapper) >= 0 ? wrapper : mark), '')

    if (!antDesignTemplateMark) {
      return css
    }

    // Escape the mark to be RegExp friendly
    const escapedMark = antDesignTemplateMark.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Split, map, remove all, add one, clean double spaces
    const lines = css.split('\n').map((line) => {
      if (line.indexOf(antDesignTemplateMark) === -1) {
        return line
      }

      const finder = new RegExp(escapedMark, 'g')
      const finderNested = new RegExp('(?<!^(?<!s))' + escapedMark + ' ', 'g')
      const replaceNestedLine = line.replace(finderNested, '')
      const replaceLine = `${antDesignTemplateMark} ${replaceNestedLine.replace(finder, '')}`
      const removeTwoSpace = replaceLine.replace(/( {2})/g, ' ')
      const final = removeTwoSpace

      return final
    })

    return lines.join('\n')
  }
}

module.exports = class LessPlugin {
  constructor(options) {
    this.options = options
    this.install = this.install.bind(this)
    this._PostProcessor = null
    this._PreProcessor = null
    this.minVersion = [0, 0, 1]

    this.setOptions = (theOptions) => {
      this.options = JSON.parse(theOptions.replace(/(\r\n|\n|\r)/gm, '')) // parse options
    }
  }

  install(less, pluginManager) {
    // this._PreProcessor = preProcessor(less.FileManager)
    // pluginManager.addPreProcessor(new this._PreProcessor({
    //   ...this.options,
    //   less,
    // }))

    this._PostProcessor = postProcessor(less.FileManager)
    pluginManager.addPostProcessor(new this._PostProcessor({
      ...this.options,
      less,
    }))
  }
}
