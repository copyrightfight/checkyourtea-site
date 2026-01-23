const https = require('https');
const fs = require('fs');

const REDDIT_URL = 'https://www.reddit.com/r/vouchvault/comments/1mi176i/tea_app_search_service_vouch_if_i_helped_you.json';

function fetchRedditData() {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };

        https.get(REDDIT_URL, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

async function main() {
    try {
        console.log('Fetching Reddit reviews...');
        const data = await fetchRedditData();
        
        // Extract comments from the thread
        const comments = data[1].data.children;
        
        // Filter and process reviews
        const reviews = comments
            .map(comment => comment.data)
            .filter(data => {
                // Filter out deleted, removed, or question comments
                if (data.author === '[deleted]') return false;
                if (data.removed_by_category !== null) return false;
                if (!data.body || data.body.trim() === '') return false;
                if (data.body.includes('[removed]') || data.body.includes('[deleted]')) return false;
                
                // Filter out questions (comments ending with ?)
                const trimmedBody = data.body.trim();
                if (trimmedBody.endsWith('?')) return false;
                
                // Filter out very short comments (likely not reviews)
                if (trimmedBody.length < 15) return false;
                
                return true;
            })
            .map(data => ({
                username: `u/${data.author}`,
                text: data.body,
                date: formatDate(data.created_utc),
                url: `https://reddit.com${data.permalink}`
            }));
        
        console.log(`Found ${reviews.length} valid reviews`);
        
        // Save to JSON file
        fs.writeFileSync('reviews.json', JSON.stringify(reviews, null, 2));
        console.log('Reviews saved to reviews.json');
        
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        process.exit(1);
    }
}

main();
