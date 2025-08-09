const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles']
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer')

const assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg')
const sourceExts = [...config.resolver.sourceExts, 'svg']

config.resolver.assetExts = assetExts
config.resolver.sourceExts = sourceExts

module.exports = withNativeWind(config, { input: './global.css' })