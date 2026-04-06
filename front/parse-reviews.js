const fs = require('fs');

const html = fs.readFileSync('review.html', 'utf8');
const reviews = [];

// Find all review cards
const reviewCardRegex = /<div data-testid="review-card"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
let match;

while ((match = reviewCardRegex.exec(html)) !== null) {
  const card = match[1];
  
  // Extract rating (all seem to be 5.0)
  const hasRating = card.includes('data-testid="filled-star"');
  if (!hasRating) continue;
  
  // Extract type and location
  const typeMatch = card.match(/(Seller|Buyer)\s+of\s+house[^<]*in\s+([^<,]+)/);
  if (!typeMatch) continue;
  
  const type = typeMatch[1];
  const location = typeMatch[2]?.trim() || 'Brisbane';
  
  // Extract time
  const timeMatch = card.match(/(\d+\s+(days?|months?|years?)\s+ago)/);
  const time = timeMatch ? timeMatch[1] : '';
  
  // Extract review text - get all paragraphs with class containing xYFng
  const textMatches = card.match(/<p[^>]*xYFng[^>]*>([^<]+(?:\.\.\.)?)<\/p>/g) || [];
  let content = '';
  
  if (textMatches.length > 0) {
    // Get the last paragraph which usually contains the review text
    const reviewTexts = textMatches
      .map(m => m.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim())
      .filter(t => t && !t.includes('Read more') && !t.match(/^\d+\.\d+$/));
    
    if (reviewTexts.length > 0) {
      content = reviewTexts.join(' ').replace(/\.\.\.$/, '').trim();
    }
  }
  
  if (content) {
    reviews.push({
      id: reviews.length + 1,
      rating: 5,
      type: type,
      location: location,
      content: content,
      time: time
    });
  }
}

console.log(JSON.stringify(reviews, null, 2));
console.log(`\nTotal reviews extracted: ${reviews.length}`);
