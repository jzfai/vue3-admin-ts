//https://mubiaozhan.cn/web/content/264

module.exports = {
  // preset: 'ts-jest',
  // globals: {},
  // testEnvironment: 'jsdom',
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.vue$': 'vue3-jest',
    '^.+\\js$': 'babel-jest'
  },
  testMatch: ['**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transformIgnorePatterns: ['/node_modules/'],
  // collectCoverageFrom: [
  //   'src/utils/**/*.{js,vue}',
  //   '!src/utils/auth.js',
  //   '!src/utils/request.js',
  //   'src/components/**/*.{js,vue}'
  // ],
  testEnvironmentOptions: {
    url: 'http://localhost/'
  }
}
