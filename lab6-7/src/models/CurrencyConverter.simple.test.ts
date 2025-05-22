import { CurrencyConverter } from './CurrencyConverter';

describe('CurrencyConverter - Simple Tests', () => {
  let converter: CurrencyConverter;

  beforeEach(() => {
    converter = new CurrencyConverter();
  });

  test('should initialize with USD as preferred currency', () => {
    expect(converter.getPreferredCurrency()).toBe('USD');
  });

  test('should set and get preferred currency', () => {
    converter.setPreferredCurrency('EUR');
    expect(converter.getPreferredCurrency()).toBe('EUR');
  });
}); 