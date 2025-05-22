import { CurrencyConverter } from './models/CurrencyConverter';
import { ExchangeRateService } from './services/ExchangeRateService';
import { setupCurrencyMock } from './mocks/setupMocks';

async function main() {
  try {
    console.log('Setting up currency mock server...');
    const mock = await setupCurrencyMock();
    console.log(`Mock server running at ${mock.mockUrl}`);
    
    const converter = new CurrencyConverter();
    const exchangeRateService = new ExchangeRateService(`${mock.mockUrl}/latest`);
    
    const rates = await exchangeRateService.fetchExchangeRates('USD');
    converter.setExchangeRates(rates);
    
    const usdToEur = converter.convert('USD', 'EUR', 100);
    console.log(`100 USD to EUR: ${usdToEur.result.toFixed(2)} EUR (rate: ${usdToEur.rate})`);
    
    const eurToGbp = converter.convert('EUR', 'GBP', 50);
    console.log(`50 EUR to GBP: ${eurToGbp.result.toFixed(2)} GBP (rate: ${eurToGbp.rate})`);
    
    // const eurToGbps = converter.convert('EUR', 'GBZ', 50);
    // console.log(`-----------50 EUR to GBZ: ${eurToGbp.result.toFixed(2)} GBP (rate: ${eurToGbps.rate})`);

    converter.setCommissionRate(0.05);
    console.log(`\nChanged commission rate to ${converter.getCommissionRate() * 100}%`);
    
    const usdToEurHighCommission = converter.convert('USD', 'EUR', 100);
    console.log(`100 USD to EUR with ${converter.getCommissionRate() * 100}% commission: ${usdToEurHighCommission.result.toFixed(2)} EUR`);
    
    console.log('\nConversion history:');
    const history = converter.getConversionHistory();
    history.forEach((conversion, index) => {
      console.log(`${index + 1}. ${conversion.amount} ${conversion.from} to ${conversion.to}: ${conversion.result.toFixed(2)} ${conversion.to}`);
    });
    
    const stats = converter.getConversionStatistics();
    console.log(`\nTotal amount converted: ${stats.totalConverted}`);
    
    const optimalPath = converter.findOptimalConversionPath('EUR', 'GBP');
    console.log(`\nOptimal conversion path from EUR to GBP: ${optimalPath ? 'Through ' + optimalPath : 'Direct conversion'}`);
    
    // console.log('\nShutting down mock server...');
    // await mock.stop();
    // console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 