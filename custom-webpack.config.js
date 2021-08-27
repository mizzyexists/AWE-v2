/**
 * Custom angular webpack configuration
 */
const JavaScriptObfuscator = require('webpack-obfuscator');
module.exports = (config, options) => {

    if (config.mode === 'production') {
        config.plugins.push(new JavaScriptObfuscator({
          compact: true,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: false,
          debugProtectionInterval: false,
          disableConsoleOutput: false,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: false,
          renameGlobals: false,
          renameProperties: false,
          rotateStringArray: true,
          selfDefending: false,
          shuffleStringArray: true,
          simplify: true,
          splitStrings: false,
          stringArray: true,
          stringArrayEncoding: [],
          stringArrayIndexShift: true,
          stringArrayWrappersCount: 1,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 2,
          stringArrayWrappersType: 'variable',
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false
        }, []));
    }
    return config;
}
