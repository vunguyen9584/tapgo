import { saveQuote } from '../../lib/firebase';
import { getCopyrightCompliantQuotes } from './index';

/**
 * Utility function to seed the quotes database with initial quotes
 * This should be called once during setup or when the database is empty
 */
export async function seedQuotesIfEmpty(): Promise<void> {
  try {
    const seedQuotes = getCopyrightCompliantQuotes();
    
    console.log(`Seeding ${seedQuotes.length} quotes to the database...`);
    
    for (const quoteData of seedQuotes) {
      const quoteId = await saveQuote(quoteData);
      if (quoteId) {
        console.log(`✅ Saved quote: "${quoteData.text.substring(0, 50)}..."`);
      } else {
        console.error(`❌ Failed to save quote: "${quoteData.text.substring(0, 50)}..."`);
      }
    }
    
    console.log('✅ Quote seeding completed');
  } catch (error) {
    console.error('❌ Failed to seed quotes:', error);
  }
}

/**
 * Check if quotes collection is empty and seed if needed
 */
export async function checkAndSeedQuotes(): Promise<void> {
  // Import here to avoid circular dependencies in client code
  const { getQuotes } = await import('../../lib/firebase');
  
  try {
    const existingQuotes = await getQuotes();
    
    if (existingQuotes.length === 0) {
      console.log('No quotes found in database. Seeding initial quotes...');
      await seedQuotesIfEmpty();
    } else {
      console.log(`Found ${existingQuotes.length} quotes in database. Skipping seeding.`);
    }
  } catch (error) {
    console.error('Failed to check existing quotes:', error);
  }
}
