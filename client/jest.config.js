/** @type {import('jest').Config} */
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Directorio raíz del proyecto
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Soporte para imports con alias "@/..."
    '^@/(.*)$': '<rootDir>/src/$1',
    // Soporte para estilos CSS y similares (ignorar durante test)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};

module.exports = createJestConfig(customJestConfig);

