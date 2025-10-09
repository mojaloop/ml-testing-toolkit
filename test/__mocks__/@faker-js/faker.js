/**
 * Mock for @faker-js/faker to handle ESM compatibility issues in Jest
 *
 * RATIONALE:
 * @faker-js/faker v10.0.0+ uses ESM (ECMAScript Modules) format which Jest
 * cannot handle natively in a CommonJS environment. This mock provides a
 * CommonJS-compatible replacement that:
 *
 * 1. ONLY affects Jest unit tests (via moduleNameMapper in jest.config.js)
 * 2. Does NOT affect production runtime - real faker is used in production
 * 3. Provides predictable but somewhat dynamic test data
 * 4. Maintains the same API structure as the real faker library
 *
 * FUTURE UPGRADE PATH:
 * When Jest adds full native ESM support (expected in v30+), this mock can be
 * removed and tests will work with the real @faker-js/faker package without changes.
 *
 * ALTERNATIVES CONSIDERED:
 * - Downgrading to faker v7.x (last CommonJS version): Not future-proof
 * - Using experimental ESM in Jest: Still unstable and may cause issues
 * - Babel transformation: Adds complexity and slows down tests
 *
 * This approach is the simplest and most maintainable solution for now.
 */

// Counter for generating unique but predictable values
let counter = 0

// Reset function for test isolation (can be called in beforeEach)
const resetCounter = () => {
  counter = 0
}

module.exports = {
  resetCounter,
  faker: {
    string: {
      // Generate semi-dynamic but predictable UUIDs for tests
      uuid: () => {
        counter++
        return `${counter.toString().padStart(8, '0')}-0000-4000-8000-${Date.now().toString().slice(-12).padStart(12, '0')}`
      },
      // Generate alphanumeric strings with optional length
      alphanumeric: (length = 10) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        return Array.from({ length }, (_, i) => chars[i % chars.length]).join('')
      },
      sample: () => `sample_${counter++}`
    },
    number: {
      // Generate predictable but varying integers
      int: (options = {}) => {
        const min = options.min || 0
        const max = options.max || 1000
        counter++
        return min + (counter % (max - min + 1))
      },
      // Generate predictable but varying floats
      float: (options = {}) => {
        const min = options.min || 0
        const max = options.max || 100
        counter++
        return min + ((counter * 1.23) % (max - min))
      }
    },
    datatype: {
      // Alternate between true and false
      boolean: () => (counter++ % 2) === 0
    },
    date: {
      // Generate dates that increment by day
      recent: (days = 10) => {
        const date = new Date('2023-01-01T00:00:00.000Z')
        date.setDate(date.getDate() + (counter++ % days))
        return date
      }
    },
    lorem: {
      word: () => ['lorem', 'ipsum', 'dolor', 'sit', 'amet'][counter++ % 5],
      words: (count = 3) => {
        const wordList = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit']
        return Array.from({ length: count }, (_, i) => wordList[(counter + i) % wordList.length]).join(' ')
      },
      sentence: () => {
        const sentences = [
          'Lorem ipsum dolor sit amet.',
          'Consectetur adipiscing elit.',
          'Sed do eiusmod tempor incididunt.',
          'Ut labore et dolore magna aliqua.'
        ]
        return sentences[counter++ % sentences.length]
      }
    },
    person: {
      firstName: () => ['John', 'Jane', 'Bob', 'Alice', 'Charlie'][counter++ % 5],
      lastName: () => ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown'][counter++ % 5],
      fullName: () => {
        const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie']
        const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown']
        const idx = counter++ % 5
        return `${firstNames[idx]} ${lastNames[idx]}`
      }
    },
    internet: {
      email: () => {
        const names = ['john', 'jane', 'bob', 'alice', 'charlie']
        const domains = ['example.com', 'test.org', 'demo.net', 'sample.io', 'mock.dev']
        const idx = counter++ % 5
        return `${names[idx]}@${domains[idx]}`
      },
      url: () => {
        const paths = ['home', 'about', 'contact', 'products', 'services']
        return `https://example.com/${paths[counter++ % 5]}`
      }
    },
    helpers: {
      arrayElement: (arr) => {
        if (!arr || arr.length === 0) return null
        return arr[counter++ % arr.length]
      },
      arrayElements: (arr, count) => {
        if (!arr || arr.length === 0) return []
        const num = count || Math.min(3, arr.length)
        return Array.from({ length: num }, (_, i) => arr[(counter + i) % arr.length])
      }
    }
  }
}
