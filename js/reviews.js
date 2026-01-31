// Reviews Module - XSS-Safe Rendering

const Reviews = {
    data: [],
    currentPage: 1,
    itemsPerPage: 9,

    async init() {
        try {
            await this.loadReviews();
            this.render();
        } catch (error) {
            console.error('Failed to load reviews:', error);
            this.showError('Failed to load reviews. Please try again later.');
        }
    },

    async loadReviews() {
        const response = await fetch('/data/reviews.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        this.data = await response.json();
    },

    render() {
        const container = document.getElementById('reviews');
        if (!container) return;

        container.innerHTML = '';

        if (this.data.length === 0) {
            container.innerHTML = '<div class="reviews-empty">No reviews available yet.</div>';
            return;
        }

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageData = this.data.slice(start, end);

        pageData.forEach((review, index) => {
            const card = this.createCard(review);
            container.appendChild(card);
            // Stagger animation
            setTimeout(() => {
                card.classList.add('animate-fade-in');
            }, index * 50);
        });

        this.renderPagination();
    },

    createCard(review) {
        const article = document.createElement('article');
        article.className = 'review-card';

        // Rating
        if (review.rating) {
            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'review-rating';
            for (let i = 0; i < review.rating; i++) {
                const star = document.createElement('span');
                star.textContent = '★';
                ratingDiv.appendChild(star);
            }
            article.appendChild(ratingDiv);
        }

        // Text (XSS-safe using textContent)
        const text = document.createElement('p');
        text.textContent = review.text;
        article.appendChild(text);

        // Meta (source, date)
        const meta = document.createElement('small');
        meta.textContent = `— ${review.source || 'User'}, ${review.date || 'Recently'}`;
        article.appendChild(meta);

        return article;
    },

    renderPagination() {
        const container = document.getElementById('reviews');
        const totalPages = Math.ceil(this.data.length / this.itemsPerPage);

        if (totalPages <= 1) return;

        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'reviews-pagination';

        // Previous button
        if (this.currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'pagination-btn';
            prevBtn.textContent = '← Previous';
            prevBtn.onclick = () => this.goToPage(this.currentPage - 1);
            paginationDiv.appendChild(prevBtn);
        }

        // Page info
        const pageInfo = document.createElement('span');
        pageInfo.style.alignSelf = 'center';
        pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        paginationDiv.appendChild(pageInfo);

        // Next button
        if (this.currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'pagination-btn';
            nextBtn.textContent = 'Next →';
            nextBtn.onclick = () => this.goToPage(this.currentPage + 1);
            paginationDiv.appendChild(nextBtn);
        }

        container.parentElement.appendChild(paginationDiv);
    },

    goToPage(page) {
        this.currentPage = page;
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    showError(message) {
        const container = document.getElementById('reviews');
        if (container) {
            container.innerHTML = `<div class="reviews-empty">${message}</div>`;
        }
    }
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    Reviews.init();
});
