module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            isolatedModules: true,
            diagnostics: false // Отключаем диагностику для ускорения
        }]
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testTimeout: 180000, // 3 минуты максимального таймаута
    verbose: true, // Подробный вывод
    maxWorkers: 1, // Выполняем тесты последовательно
    bail: true, // Останавливаем тесты после первой ошибки
    // Игнорируем тяжелые файлы для оптимизации памяти
    transformIgnorePatterns: [],
    forceExit: true, // Принудительно выходим после выполнения
    testPathIgnorePatterns: ['node_modules'],
    detectOpenHandles: true, // Обнаруживаем незакрытые соединения
    // Используем альтернативный обработчик таймаутов для более стабильной работы
    testRunner: 'jest-circus/runner',
    // Повторяем тесты до 2 раз, если они падают
    retry: 1
};