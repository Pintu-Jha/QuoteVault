import { Quote } from '../types';

const API_BASE_URL = 'https://zenquotes.io/api';

const CATEGORIES = ['Motivation', 'Love', 'Success', 'Wisdom', 'Humor', 'Life'];

const assignCategory = (text: string, author: string): string => {
    const t = text.toLowerCase();
    // const a = author.toLowerCase(); // Author check can be added if specific authors are known for categories

    if (t.includes('love') || t.includes('heart') || t.includes('soul') || t.includes('passion')) return 'Love';
    if (t.includes('success') || t.includes('goal') || t.includes('dream') || t.includes('work') || t.includes('fail')) return 'Success';
    if (t.includes('wise') || t.includes('wisdom') || t.includes('truth') || t.includes('knowledge') || t.includes('mind')) return 'Wisdom';
    if (t.includes('laugh') || t.includes('humor') || t.includes('funny') || t.includes('smile') || t.includes('joke')) return 'Humor';
    if (t.includes('life') || t.includes('time') || t.includes('live') || t.includes('world') || t.includes('peace')) return 'Life';

    return 'Motivation';
};

export const quoteService = {
    getRandomQuotes: async (count: number = 10): Promise<Quote[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/quotes`);
            const data = await response.json();

            // Handle potential API variations or empty responses
            if (!Array.isArray(data)) {
                console.warn('API Response is not an array:', data);
                return [];
            }

            return data.slice(0, count).map((item: any, index: number) => ({
                id: `${Date.now()}-${index}`,
                text: item.q,
                author: item.a,
                category: assignCategory(item.q, item.a),
            }));
        } catch (error) {
            console.error('Failed to fetch quotes:', error);
            return [];
        }
    },

    getQuoteOfTheDay: async (): Promise<Quote | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/today`);
            const data = await response.json();

            if (data && data.length > 0) {
                return {
                    id: `qotd-${Date.now()}`,
                    text: data[0].q,
                    author: data[0].a,
                    category: 'Daily',
                };
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch quote of the day:', error);
            return null;
        }
    },

    searchQuotes: async (query: string): Promise<Quote[]> => {
        try {
            const quotes = await quoteService.getRandomQuotes(20);
            return quotes.filter(
                quote =>
                    quote.text.toLowerCase().includes(query.toLowerCase()) ||
                    quote.author.toLowerCase().includes(query.toLowerCase())
            );
        } catch (error) {
            console.error('Failed to search quotes:', error);
            return [];
        }
    },

    getQuotesByCategory: async (category: string): Promise<Quote[]> => {
        try {
            const quotes = await quoteService.getRandomQuotes(20);
            return quotes.map(quote => ({ ...quote, category }));
        } catch (error) {
            console.error('Failed to fetch quotes by category:', error);
            return [];
        }
    },

    getCategories: () => {
        return CATEGORIES.map((name, index) => ({
            id: `cat-${index}`,
            name,
            description: `Explore ${name.toLowerCase()} quotes`,
        }));
    },
};
