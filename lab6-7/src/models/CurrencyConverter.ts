export interface ExchangeRate {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: number;
}

export interface ConversionHistory {
  conversions: ConversionResult[];
  totalConverted: number;
}

export class CurrencyConverter {
  private exchangeRates: ExchangeRate | null = null;
  private conversionHistory: ConversionResult[] = [];
  private preferredCurrency: string = 'USD';
  private commissionRate: number = 0.02;
  private lastUpdated: Date | null = null;

  /**
   * @param exchangeRates 
   */
  public setExchangeRates(exchangeRates: ExchangeRate): void {
    this.exchangeRates = exchangeRates;
    this.lastUpdated = new Date();
  }

  /**
   * @returns current exchange rates
   * @throws Error if exchange rates are not set
   */
  public getExchangeRates(): ExchangeRate {
    if (!this.exchangeRates) {
      throw new Error('Exchange rates not set');
    }
    return this.exchangeRates;
  }

  /**
   * @returns true if exchange rates are valid
   */
  public areExchangeRatesValid(): boolean {
    if (!this.exchangeRates || !this.lastUpdated) {
      return false;
    }
    
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    return this.lastUpdated > oneHourAgo;
  }

  /**
   * @param currency 
   */
  public setPreferredCurrency(currency: string): void {
    if (currency.length !== 3) {
      throw new Error('Currency code must be 3 characters');
    }
    this.preferredCurrency = currency.toUpperCase();
  }

  /**
   * @returns currency code
   */
  public getPreferredCurrency(): string {
    return this.preferredCurrency;
  }

  /**
   * @param rate 
   * @throws Error if rate is negative or greater than 0.1 (10%)
   */
  public setCommissionRate(rate: number): void {
    if (rate < 0 || rate > 0.1) {
      throw new Error('Commission rate must be between 0 and 0.1 (10%)');
    }
    this.commissionRate = rate;
  }

  /**
   * @returns The commission rate
   */
  public getCommissionRate(): number {
    return this.commissionRate;
  }

  /**
   * @param fromCurrency 
   * @param toCurrency 
   * @param amount 
   * @returns conversion result
   * @throws Error if exchange rates are not set or currencies are invalid
   */
  public convert(fromCurrency: string, toCurrency: string, amount: number): ConversionResult {
    if (!this.exchangeRates) {
      throw new Error('Exchange rates not set');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    if (fromCurrency !== this.exchangeRates.base && !this.exchangeRates.rates[fromCurrency]) {
      throw new Error(`Currency not found: ${fromCurrency}`);
    }

    if (toCurrency !== this.exchangeRates.base && !this.exchangeRates.rates[toCurrency]) {
      throw new Error(`Currency not found: ${toCurrency}`);
    }

    let rate: number;
    
    if (fromCurrency === this.exchangeRates.base) {
      rate = this.exchangeRates.rates[toCurrency];
    } else if (toCurrency === this.exchangeRates.base) {
      rate = 1 / this.exchangeRates.rates[fromCurrency];
    } else {
      const fromRate = this.exchangeRates.rates[fromCurrency];
      const toRate = this.exchangeRates.rates[toCurrency];
      rate = toRate / fromRate;
    }

    const result = amount * rate * (1 - this.commissionRate);

    const conversionResult: ConversionResult = {
      from: fromCurrency,
      to: toCurrency,
      amount,
      result,
      rate,
      timestamp: Date.now()
    };

    this.conversionHistory.push(conversionResult);

    return conversionResult;
  }

  /**
   * @param limit 
   * @returns conversion history
   */
  public getConversionHistory(limit?: number): ConversionResult[] {
    if (limit) {
      return [...this.conversionHistory].slice(-limit);
    }
    return [...this.conversionHistory];
  }

  /**
   * @returns Conversion history statistics
   */
  public getConversionStatistics(): ConversionHistory {
    const totalConverted = this.conversionHistory.reduce((sum, conv) => sum + conv.amount, 0);
    
    return {
      conversions: [...this.conversionHistory],
      totalConverted
    };
  }

  public clearConversionHistory(): void {
    this.conversionHistory = [];
  }

  /**
   * @param fromCurrency 
   * @param toCurrency 
   * @returns best intermediate currency or null if direct is best
   */
  public findOptimalConversionPath(fromCurrency: string, toCurrency: string): string | null {
    if (!this.exchangeRates) {
      throw new Error('Exchange rates not set');
    }

    if (fromCurrency === this.exchangeRates.base || toCurrency === this.exchangeRates.base) {
      return null;
    }

    const directRate = this.exchangeRates.rates[toCurrency] / this.exchangeRates.rates[fromCurrency];
    const throughBaseRate = this.exchangeRates.rates[toCurrency] * (1 / this.exchangeRates.rates[fromCurrency]);

    if (Math.abs(directRate - throughBaseRate) < 0.001) {
      return null;
    }

    return directRate > throughBaseRate ? null : this.exchangeRates.base;
  }
} 