module.exports = {
  preset: 'react-native',
  watchman: false,
  moduleNameMapper: {
    '^@env$': '<rootDir>/__mocks__/env.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/android/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-native-keychain|react-native-screens|react-native-safe-area-context)/)',
  ],
};
