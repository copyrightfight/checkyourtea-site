#!/usr/bin/env node

/**
 * Fetch Reviews from Reddit
 * 
 * Production-grade script with:
 * - Retry logic with exponential backoff
 * - Schema validation
 * - Error handling
 * - Deterministic output
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '../data/reviews.json');

// Configuration
const REDDIT_URL = 'https://www.reddit.com/r/teaapp/comments.json';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 8000;
const USER_AGENT = 'CheckYourTea-Bot/1.0 (+https://checkyourtea.com)';

/**
 * Fetch with retry logic and exponential backoff
 */
async function fetchWithRetry(url, retries = MAX_RETRIES) {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch(url, {
                headers: {
                    'User-Agent': USER_AGENT
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            const isLastAttempt = attempt === retries - 1;

            if (isLastAttempt) {
                throw new Error(`Failed after ${retries} attempts: ${error.message}`);
            }

            // Exponential backoff
            const delay = 1000 * Math.pow(2, attempt);
            console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

/**
 * Validate Reddit API response structure
 */
function validateRedditResponse(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Response is not an object');
    }

    if (!Array.isArray(data?.data?.children)) {
        throw new Error('Unexpected Reddit API structure: missing data.children array');
    }

    return true;
}

/**
 * Normalize a Reddit post into review format
 */
function normalizePost(post) {
    try {
        const data = post?.data;
        if (!data) return null;

        const text = (data.selftext || '').trim();
        
        // Skip empty or very short posts
        if (text.length < 40) {
            return null;
        }

        // Skip questions (end with ?)
        if (text.endsWith('?')) {
            return null;
        }

        // Skip if contains spam indicators
        if (text.toLowerCase().includes('click here') || text.toLowerCase().includes('buy now')) {
            return null;
        }

        return {
            text: text.slice(0, 500), // Truncate to 500 chars
            source: 'Reddit',
            date: new Date(data.created_utc * 1000).toISOString().split('T')[0],
            score: data.score || 0,
            author: data.author || 'Anonymous'
        };
    } catch (error) {
        console.warn(`Failed to normalize post: ${error.message}`);
        return null;
    }
}

/**
 * Main function
 */
async function main() {
    try {
        console.log('Fetching reviews from Reddit...');
        const data = await fetchWithRetry(REDDIT_URL);

        console.log('Validating response...');
        validateRedditResponse(data);

        console.log('Processing posts...');
        const reviews = data.data.children
            .map(normalizePost)
            .filter(review => review !== null)
            .sort((a, b) => b.score - a.score) // Sort by score
            .slice(0, 50); // Keep top 50

        // Ensure output directory exists
        const outputDir = path.dirname(OUTPUT_PATH);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write output
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(reviews, null, 2));
        console.log(`✓ Successfully saved ${reviews.length} reviews to ${OUTPUT_PATH}`);

        // Log summary
        console.log(`\nSummary:`);
        console.log(`- Total reviews: ${reviews.length}`);
        console.log(`- Average score: ${(reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(0)}`);
        console.log(`- Date range: ${reviews[reviews.length - 1]?.date} to ${reviews[0]?.date}`);

    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

// Run
main();
