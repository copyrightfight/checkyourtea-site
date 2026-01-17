# CheckYourTea Reviews Section Integration Guide

## Overview
You now have a professional **scrollable reviews section** that displays 35+ verified Reddit reviews from your vouch thread. Each review links directly to the original Reddit post.

---

## What Was Created

### ✅ `reviews.html` - Standalone Reviews Component
A complete, self-contained HTML page featuring:
- **Scrollable container** (max height: 650px) containing all reviews
- **Responsive grid layout** (3 columns desktop, 1 column mobile)
- **Review cards** with:
  - Reddit avatar (with gradient)
  - Username (linked in blue)
  - Verified badge (✓)
  - 5-star rating
  - Review text (truncated to 4 lines max)
  - Timestamp
  - "View on Reddit →" indicator on hover
  - Direct link to original Reddit comment when clicked
- **Keyword highlighting** (auto-highlights positive words: legit, fast, recommend, etc.)
- **Custom scrollbar** (styled to match CheckYourTea blue theme)
- **Hover effects** with smooth transitions
- **Mobile responsive** design

---

## How to Integrate Into Your Site

### Option 1: Embed as an iFrame (Easiest)

Add this line to your `index.html` where you want the reviews section:

```html
<iframe src="reviews.html" style="width: 100%; border: none; border-radius: 12px;" height="800"></iframe>
```

**Pros:** Simple, no code changes needed
**Cons:** iFrame has isolation limitations

---

### Option 2: Copy the Reviews Section Code (Recommended)

**Step 1:** Open `reviews.html`

**Step 2:** Copy the entire `<style>` section (the CSS styling)

**Step 3:** Paste it into your `index.html` `<head>` section

**Step 4:** Add this section to your `index.html` body where you want reviews:

```html
<!-- Reviews Section -->
<section class="reviews-section" id="reddit-reviews">
    <h2 class="section-title">Client Testimonials</h2>
    <p class="section-subtitle">Real reviews from real users. Click any card to view the original Reddit comment.</p>
    
    <div class="reviews-container-wrapper">
        <div class="reviews-scroll-container" id="reviews-grid">
            <!-- Reviews will be dynamically inserted here -->
        </div>
    </div>
</section>
```

**Step 5:** Copy the `<script>` section from `reviews.html` and paste it before the closing `</body>` tag in your `index.html`

**Step 6:** Update your navigation to link to the reviews section:

```html
<li><a onclick="scrollToSection('reddit-reviews')">Reviews</a></li>
```

---

## Review Data Included

**35 verified, cleaned reviews** from your Reddit vouch thread:
- ✓ All questions/spam removed
- ✓ All deleted users filtered out
- ✓ Reviews with long threads truncated
- ✓ Each includes direct Reddit permalink
- ✓ Formatted with username, review text, and timestamp

**Top reviewers by length:**
- DirectionMinute8788 - Long detailed review
- FluidRecognitionX - Comprehensive testimonial
- OkSolid2429 - Emotional, detailed experience

---

## Customization Options

### Change Maximum Scroll Height
Find this in the CSS:
```css
.reviews-scroll-container {
    max-height: 650px;  /* Change this number */
}
```

### Change Column Count
Find this in the CSS:
```css
.reviews-scroll-container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));  /* Adjust minmax value */
}
```
- Smaller first number = narrower cards = more columns
- Larger first number = wider cards = fewer columns

### Change Colors
Update the CSS color variables:
```css
:root {
    --accent-blue: #2563eb;      /* Link/highlight color */
    --card-bg: #f1f5f9;          /* Card background */
    --text-secondary: #475569;   /* Review text color */
}
```

### Add/Remove Keywords to Highlight
Find this in the JavaScript:
```javascript
const keywords = ['legit', 'fast', 'recommend', 'peace of mind', 'real deal', /* add more */];
```

---

## File Information

**File:** `reviews.html`
**Size:** ~21KB
**Reviews:** 35 verified testimonials
**Styling:** Custom CSS (CheckYourTea theme compatible)
**Compatibility:** Modern browsers (Chrome, Firefox, Safari, Edge)

---

## Next Steps

1. ✅ **Test** - Open `reviews.html` in your browser to see the component
2. ✅ **Integrate** - Choose Option 1 or 2 above
3. ✅ **Customize** - Adjust colors/sizing as needed
4. ✅ **Deploy** - Push to Netlify and test on live site

---

## Troubleshooting

**Reviews not showing?**
- Make sure the JavaScript runs after DOM loads
- Check browser console for errors (F12 → Console tab)
- Verify `reviews-grid` element exists

**Scrollbar not working?**
- Ensure CSS is properly loaded
- Check that `.reviews-scroll-container` has `max-height` set
- Test in different browser

**Links not working?**
- Click on a review card should open Reddit in new tab
- Check that `target="_blank"` is in the HTML
- Verify Reddit URLs are correct

---

## Questions?

The component is fully self-contained and production-ready. All 35 reviews are pre-cleaned and formatted with direct Reddit links.
