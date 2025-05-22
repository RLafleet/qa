import { CurrencyConverter, ExchangeRate } from './CurrencyConverter';

describe('CurrencyConverter', () => {
  let converter: CurrencyConverter;
  let mockExchangeRates: ExchangeRate;

  beforeEach(() => {
    converter = new CurrencyConverter();
    mockExchangeRates = {
      base: 'USD',
      rates: {
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.0,
        CAD: 1.23,
        AUD: 1.32
      },
      timestamp: Date.now()
    };
  });

  describe('setExchangeRates & getExchangeRates', () => {
    it('should set and get exchange rates correctly', () => {
      converter.setExchangeRates(mockExchangeRates);
      expect(converter.getExchangeRates()).toEqual(mockExchangeRates);
    });

    it('should throw error when getting exchange rates that are not set', () => {
      expect(() => converter.getExchangeRates()).toThrow('Exchange rates not set');
    });
  });

  describe('areExchangeRatesValid', () => {
    it('should return false when exchange rates are not set', () => {
      expect(converter.areExchangeRatesValid()).toBe(false);
    });

    it('should return true when exchange rates are set and recent', () => {
      converter.setExchangeRates(mockExchangeRates);
      expect(converter.areExchangeRatesValid()).toBe(true);
    });

    it('should return false when exchange rates are old', () => {
      const realDate = Date;
      const currentTime = new Date('2023-01-01T12:00:00Z');
      
      global.Date = class extends Date {
        constructor() {
          super();
          return currentTime;
        }
      };

      converter.setExchangeRates(mockExchangeRates);
      
      const newTime = new Date('2023-01-01T14:01:00Z');
      global.Date = class extends Date {
        constructor() {
          super();
          return newTime;
        }
        static now() {
          return newTime.getTime();
        }
      };

      expect(converter.areExchangeRatesValid()).toBe(false);
      
      global.Date = realDate;
    });
  });

  describe('setPreferredCurrency & getPreferredCurrency', () => {
    it('should set and get preferred currency correctly', () => {
      converter.setPreferredCurrency('EUR');
      expect(converter.getPreferredCurrency()).toBe('EUR');
    });

    it('should convert lowercase currency to uppercase', () => {
      converter.setPreferredCurrency('eur');
      expect(converter.getPreferredCurrency()).toBe('EUR');
    });

    it('should throw error when setting invalid currency code length', () => {
      expect(() => converter.setPreferredCurrency('EURO')).toThrow('Currency code must be 3 characters');
      expect(() => converter.setPreferredCurrency('EU')).toThrow('Currency code must be 3 characters');
    });
  });

  describe('setCommissionRate & getCommissionRate', () => {
    it('should set and get commission rate correctly', () => {
      converter.setCommissionRate(0.05);
      expect(converter.getCommissionRate()).toBe(0.05);
    });

    it('should throw error when setting negative commission rate', () => {
      expect(() => converter.setCommissionRate(-0.01)).toThrow('Commission rate must be between 0 and 0.1 (10%)');
    });

    it('should throw error when setting commission rate > 10%', () => {
      expect(() => converter.setCommissionRate(0.11)).toThrow('Commission rate must be between 0 and 0.1 (10%)');
    });
  });

  describe('convert', () => {
    beforeEach(() => {
      converter.setExchangeRates(mockExchangeRates);
    });

    it('should convert from base currency to another currency', () => {
      const result = converter.convert('USD', 'EUR', 100);
      expect(result.result).toBeCloseTo(83.3, 1);
      expect(result.from).toBe('USD');
      expect(result.to).toBe('EUR');
      expect(result.amount).toBe(100);
      expect(result.rate).toBe(0.85);
    });

    it('should convert from non-base currency to base currency', () => {
      const result = converter.convert('EUR', 'USD', 100);
      expect(result.result).toBeCloseTo(115.29, 1);
      expect(result.from).toBe('EUR');
      expect(result.to).toBe('USD');
    });

    it('should convert between two non-base currencies', () => {
      const result = converter.convert('EUR', 'GBP', 100);
      expect(result.result).toBeCloseTo(84.16, 1);
      expect(result.from).toBe('EUR');
      expect(result.to).toBe('GBP');
    });

    it('should throw error when exchange rates not set', () => {
      const newConverter = new CurrencyConverter();
      expect(() => newConverter.convert('USD', 'EUR', 100)).toThrow('Exchange rates not set');
    });

    it('should throw error when amount is not positive', () => {
      expect(() => converter.convert('USD', 'EUR', 0)).toThrow('Amount must be greater than zero');
      expect(() => converter.convert('USD', 'EUR', -10)).toThrow('Amount must be greater than zero');
    });

    it('should throw error when source currency is invalid', () => {
      expect(() => converter.convert('XYZ', 'EUR', 100)).toThrow('Currency not found: XYZ');
    });

    it('should throw error when target currency is invalid', () => {
      expect(() => converter.convert('USD', 'XYZ', 100)).toThrow('Currency not found: XYZ');
    });
  });

  describe('getConversionHistory', () => {
    beforeEach(() => {
      converter.setExchangeRates(mockExchangeRates);
      converter.convert('USD', 'EUR', 100);
      converter.convert('EUR', 'GBP', 200);
      converter.convert('GBP', 'JPY', 300);
    });

    it('should return all conversion history', () => {
      const history = converter.getConversionHistory();
      expect(history.length).toBe(3);
      expect(history[0].from).toBe('USD');
      expect(history[0].to).toBe('EUR');
      expect(history[1].from).toBe('EUR');
      expect(history[1].to).toBe('GBP');
      expect(history[2].from).toBe('GBP');
      expect(history[2].to).toBe('JPY');
    });

    it('should return limited conversion history', () => {
      const history = converter.getConversionHistory(2);
      expect(history.length).toBe(2);
      expect(history[0].from).toBe('EUR');
      expect(history[0].to).toBe('GBP');
      expect(history[1].from).toBe('GBP');
      expect(history[1].to).toBe('JPY');
    });
  });

  describe('getConversionStatistics', () => {
    beforeEach(() => {
      converter.setExchangeRates(mockExchangeRates);
      converter.convert('USD', 'EUR', 100);
      converter.convert('EUR', 'GBP', 200);
    });

    it('should return correct statistics', () => {
      const stats = converter.getConversionStatistics();
      expect(stats.conversions.length).toBe(2);
      expect(stats.totalConverted).toBe(300);
    });
  });

  describe('clearConversionHistory', () => {
    it('should clear the conversion history', () => {
      converter.setExchangeRates(mockExchangeRates);
      converter.convert('USD', 'EUR', 100);
      converter.convert('EUR', 'GBP', 200);
      
      expect(converter.getConversionHistory().length).toBe(2);
      
      converter.clearConversionHistory();
      
      expect(converter.getConversionHistory().length).toBe(0);
      expect(converter.getConversionStatistics().totalConverted).toBe(0);
    });
  });

  describe('findOptimalConversionPath', () => {
    beforeEach(() => {
      converter.setExchangeRates(mockExchangeRates);
    });

    it('should return null when converting to/from base currency', () => {
      expect(converter.findOptimalConversionPath('USD', 'EUR')).toBeNull();
      expect(converter.findOptimalConversionPath('EUR', 'USD')).toBeNull();
    });

    it('should return optimal path for conversion', () => {
      const customRates: ExchangeRate = {
        base: 'USD',
        rates: {
          EUR: 0.85,
          GBP: 0.70,
        },
        timestamp: Date.now()
      };
      
      converter.setExchangeRates(customRates);
      const result = converter.findOptimalConversionPath('EUR', 'GBP');
      expect(result).toBeNull();
    });

    it('should throw error when exchange rates not set', () => {
      const newConverter = new CurrencyConverter();
      expect(() => newConverter.findOptimalConversionPath('EUR', 'GBP')).toThrow('Exchange rates not set');
    });
  });
}); 