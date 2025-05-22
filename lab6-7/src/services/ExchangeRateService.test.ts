import axios from 'axios';
import { ExchangeRateService } from './ExchangeRateService';

jest.mock('axios', () => {
  return {
    get: jest.fn(),
    isAxiosError: jest.fn(),
    default: {
      get: jest.fn(),
      isAxiosError: jest.fn()
    }
  };
});

const mockGet = jest.mocked(axios.get);
const mockIsAxiosError = jest.mocked(axios.isAxiosError);

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;
  
  beforeEach(() => {
    service = new ExchangeRateService('https://mock-api.example.com/latest');
    jest.clearAllMocks();
  });
  
  it('should fetch exchange rates successfully', async () => {
    const mockResponse = {
      data: {
        base: 'USD',
        rates: {
          EUR: 0.85,
          GBP: 0.73
        },
        time_last_updated: 1623168000000
      }
    };
    
    mockGet.mockResolvedValueOnce(mockResponse);
    
    const result = await service.fetchExchangeRates('USD');
    
    expect(mockGet).toHaveBeenCalledWith('https://mock-api.example.com/latest/USD');
    expect(result).toEqual({
      base: 'USD',
      rates: {
        EUR: 0.85,
        GBP: 0.73
      },
      timestamp: 1623168000000
    });
  });
  
  it('should handle API errors correctly', async () => {
    const mockError = {
      isAxiosError: true,
      message: 'Network Error'
    };
    
    mockGet.mockRejectedValueOnce(mockError);
    mockIsAxiosError.mockReturnValueOnce(true);
    
    await expect(service.fetchExchangeRates('EUR')).rejects.toThrow('Failed to fetch exchange rates: Network Error');
    expect(mockGet).toHaveBeenCalledWith('https://mock-api.example.com/latest/EUR');
  });
  
  it('should use default API URL when none provided', () => {
    const defaultService = new ExchangeRateService();
    
    mockGet.mockResolvedValueOnce({
      data: {
        base: 'USD',
        rates: {},
        time_last_updated: 0
      }
    });
    
    defaultService.fetchExchangeRates('USD');
    
    expect(mockGet).toHaveBeenCalledWith('https://api.exchangerate-api.com/v4/latest/USD');
  });
  
  it('should use timestamp from Date.now when API does not provide it', async () => {
    const originalDateNow = Date.now;
    const mockTimestamp = 1623170000000;
    Date.now = jest.fn(() => mockTimestamp);
    
    const mockResponse = {
      data: {
        base: 'USD',
        rates: {
          EUR: 0.85
        }
      }
    };
    
    mockGet.mockResolvedValueOnce(mockResponse);
    
    const result = await service.fetchExchangeRates('USD');
    
    expect(result.timestamp).toBe(mockTimestamp);
    
    Date.now = originalDateNow;
  });
}); 