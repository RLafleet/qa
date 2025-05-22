import axios from 'axios';
import { ExchangeRate } from '../models/CurrencyConverter';

export class ExchangeRateService {
  private readonly apiUrl: string;

  constructor(apiUrl: string = 'https://api.exchangerate-api.com/v4/latest') {
    this.apiUrl = apiUrl;
  }

  /**
   * @param baseCurrency 
   * @returns Promise with exchange rates
   */
  public async fetchExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRate> {
    try {
      const response = await axios.get(`${this.apiUrl}/${baseCurrency}`);
      
      return {
        base: response.data.base,
        rates: response.data.rates,
        timestamp: response.data.time_last_updated || Date.now()
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch exchange rates: ${error.message}`);
      }
      throw error;
    }
  }
} 