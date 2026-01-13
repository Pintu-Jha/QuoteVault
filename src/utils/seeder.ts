import { supabase } from '../config/supabase';
import { quoteService } from '../services/quoteService';

export const seedQuotes = async () => {
    try {
        console.log('Starting seed process...');

        const externalQuotes = await quoteService.getRandomQuotes(50);

        if (!externalQuotes || externalQuotes.length === 0) {
            throw new Error('No quotes fetched from QuoteService');
        }

        console.log(`Fetched ${externalQuotes.length} quotes from service.`);

        const quotesToInsert = externalQuotes.map((q) => ({
            text: q.text,
            author: q.author,
            category: q.category,
            created_at: new Date().toISOString(),
        }));

        const { data: dbData, error } = await supabase
            .from('quotes')
            .upsert(quotesToInsert, { onConflict: 'text' })
            .select();

        if (error) {
            console.error('Supabase insertion error:', error);
            throw error;
        }

        console.log(`Successfully inserted ${dbData?.length} quotes.`);
        return { success: true, count: dbData?.length };

    } catch (error) {
        console.error('Seeding failed:', error);
        return { success: false, error };
    }
};
