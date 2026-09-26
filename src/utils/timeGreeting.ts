/**
 * Time-based greeting helper based on system time:
 * - Shokal (Morning): 5:00 AM - 11:59 AM -> "Good Morning"
 * - Dupur (Noon): 12:00 PM - 2:59 PM -> "Good Noon"
 * - Bikel / Afternoon: 3:00 PM - 5:59 PM -> "Good Afternoon"
 * - Shonda / Night (Evening): 6:00 PM - 4:59 AM -> "Good Evening"
 */

export interface GreetingInfo {
  greeting: 'Good Morning' | 'Good Noon' | 'Good Afternoon' | 'Good Evening';
  greetingBn: string;
  period: 'morning' | 'noon' | 'afternoon' | 'evening';
  icon: string;
}

export function getTimeBasedGreeting(date: Date = new Date()): GreetingInfo {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good Morning',
      greetingBn: 'শুভ সকাল',
      period: 'morning',
      icon: '🌅'
    };
  }

  if (hour >= 12 && hour < 15) {
    return {
      greeting: 'Good Noon',
      greetingBn: 'শুভ দুপুর',
      period: 'noon',
      icon: '☀️'
    };
  }

  if (hour >= 15 && hour < 18) {
    return {
      greeting: 'Good Afternoon',
      greetingBn: 'শুভ অপরাহ্ন',
      period: 'afternoon',
      icon: '🌤️'
    };
  }

  return {
    greeting: 'Good Evening',
    greetingBn: 'শুভ সন্ধ্যা',
    period: 'evening',
    icon: '🌙'
  };
}
