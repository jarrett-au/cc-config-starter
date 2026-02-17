#!/usr/bin/env node

/**
 * 12306 Weekend Trip Query Helper
 *
 * Functions for calculating weekend dates and building query URLs
 */

/**
 * Calculate next weekend dates based on current date
 * @returns {Object} Object with friday, saturday, sunday, monday dates
 */
function getNextWeekend() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sunday, 6=Saturday

  let saturday, sunday;

  if (dayOfWeek === 6) {  // Today is Saturday
    saturday = today;
    sunday = new Date(today.getTime() + 86400000);
  } else if (dayOfWeek === 0) {  // Today is Sunday
    saturday = new Date(today.getTime() + 6 * 86400000);
    sunday = new Date(today.getTime() + 7 * 86400000);
  } else {
    const daysUntilSaturday = 6 - dayOfWeek;
    saturday = new Date(today.getTime() + daysUntilSaturday * 86400000);
    sunday = new Date(today.getTime() + (daysUntilSaturday + 1) * 86400000);
  }

  const friday = new Date(saturday.getTime() - 86400000);
  const monday = new Date(sunday.getTime() + 86400000);

  return {
    friday: formatDate(friday),
    saturday: formatDate(saturday),
    sunday: formatDate(sunday),
    monday: formatDate(monday)
  };
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Build 12306 query URL
 * @param {string} from - Origin station (URL-encoded)
 * @param {string} fromCode - Origin station code
 * @param {string} to - Destination station (URL-encoded)
 * @param {string} toCode - Destination station code
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {string} Complete URL
 */
function buildQueryUrl(from, fromCode, to, toCode, date) {
  const baseUrl = "https://kyfw.12306.cn/otn/leftTicket/init";
  // Build URL manually to avoid double encoding
  return `${baseUrl}?linktypeid=dc&fs=${from},${fromCode}&ts=${to},${toCode}&date=${date}&flag=N,Y,Y`;
}

/**
 * Generate batch query URLs for multiple destinations
 * @param {Array} destinations - Array of destination objects
 * @param {string} origin - Origin station info
 * @param {Array} dates - Array of dates to query
 * @returns {Array} Array of query objects
 */
function generateBatchQueries(destinations, origin, dates) {
  const queries = [];

  dates.forEach(date => {
    destinations.forEach(dest => {
      queries.push({
        destination: dest.name,
        url: buildQueryUrl(
          origin.encoded,
          origin.code,
          dest.encoded,
          dest.code,
          date
        ),
        date: date,
        time_range: date.includes('fri') ? '18:00-24:00' : '06:00-12:00'
      });
    });
  });

  return queries;
}

/**
 * Parse user intent from natural language
 * @param {string} input - User input text
 * @returns {Object} Parsed intent
 */
function parseUserIntent(input) {
  const intent = {
    type: 'unknown',
    destination: null,
    date: null,
    time_preference: null
  };

  // Detect recommendation request
  if (input.includes('推荐') || input.includes('去哪玩') || input.includes('有什么地方')) {
    intent.type = 'recommend';
  }

  // Detect specific destination
  const cityPattern = /去(.{2,3})(玩|玩玩|旅游|旅行)/;
  const cityMatch = input.match(cityPattern);
  if (cityMatch) {
    intent.type = 'query_specific';
    intent.destination = cityMatch[1];
  }

  // Detect date mentions
  if (input.includes('这周末') || input.includes('周末')) {
    intent.date = 'this_weekend';
  } else if (input.includes('下周')) {
    intent.date = 'next_weekend';
  }

  // Detect time preference
  if (input.includes('晚') || input.includes('18点') || input.includes('18:00')) {
    intent.time_preference = 'evening';
  } else if (input.includes('早') || input.includes('上午')) {
    intent.time_preference = 'morning';
  }

  return intent;
}

/**
 * Score destination for recommendation
 * @param {Object} dest - Destination object
 * @param {Object} preferences - User preferences
 * @returns {number} Score (0-100)
 */
function scoreDestination(dest, preferences) {
  let score = 0;

  // Travel time score (40% weight)
  const timeParts = dest.travel_time.split(':');
  const timeMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
  const idealTimeMinutes = 120; // 2 hours

  if (timeMinutes <= 90) {
    score += 40; // Excellent (1.5h or less)
  } else if (timeMinutes <= 150) {
    score += 35; // Great (1.5-2.5h)
  } else if (timeMinutes <= 210) {
    score += 25; // Good (2.5-3.5h)
  } else {
    score += 10; // Acceptable but not ideal
  }

  // Rating score (20% weight)
  score += dest.rating * 4; // 5 stars = 20 points

  // Price score (20% weight) - assuming lower is better
  const priceMatch = dest.price_range.match(/¥(\d+)-(\d+)/);
  if (priceMatch) {
    const avgPrice = (parseInt(priceMatch[1]) + parseInt(priceMatch[2])) / 2;
    if (avgPrice <= 200) {
      score += 20;
    } else if (avgPrice <= 300) {
      score += 15;
    } else if (avgPrice <= 400) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // Variety bonus (20% weight) - number of highlights
  if (dest.highlights && dest.highlights.length > 0) {
    score += Math.min(dest.highlights.length * 4, 20);
  }

  return score;
}

/**
 * Generate recommendations based on preferences
 * @param {Array} destinations - Available destinations
 * @param {Object} preferences - User preferences
 * @param {number} limit - Max number of recommendations
 * @returns {Array} Sorted and scored recommendations
 */
function generateRecommendations(destinations, preferences, limit = 5) {
  const scored = destinations.map(dest => ({
    ...dest,
    score: scoreDestination(dest, preferences)
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'next-weekend':
      const weekend = getNextWeekend();
      console.log(JSON.stringify(weekend, null, 2));
      break;

    case 'build-url':
      if (args.length < 6) {
        console.error('Usage: build-url <from-encoded> <from-code> <to-encoded> <to-code> <date>');
        process.exit(1);
      }
      const url = buildQueryUrl(args[1], args[2], args[3], args[4], args[5]);
      console.log(url);
      break;

    case 'parse':
      if (args.length < 2) {
        console.error('Usage: parse "<user input>"');
        process.exit(1);
      }
      const intent = parseUserIntent(args[1]);
      console.log(JSON.stringify(intent, null, 2));
      break;

    default:
      console.log(`
12306 Weekend Query Helper

Usage:
  node weekend-query.js <command> [arguments]

Commands:
  next-weekend              Calculate next weekend dates
  build-url <args>          Build query URL
  parse "<input>"           Parse user intent

Examples:
  node weekend-query.js next-weekend
  node weekend-query.js build-url %E6%B7%B1%E5%9C%B3%E5%8C%97 IOQ %E8%B5%A3%E5%B7%9E%E8%A5%BF GZQ 2026-02-28
  node weekend-query.js parse "这周末去哪玩"
      `);
  }
}

module.exports = {
  getNextWeekend,
  formatDate,
  buildQueryUrl,
  generateBatchQueries,
  parseUserIntent,
  scoreDestination,
  generateRecommendations
};
