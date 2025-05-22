module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30000,
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            isolatedModules: true
        }]
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.test.ts',
        '!src/**/*.d.ts',
        '!src/types/**/*.ts',
        '!src/index.ts'
    ],
    coverageReporters: ['text', 'lcov'],
    verbose: true
};