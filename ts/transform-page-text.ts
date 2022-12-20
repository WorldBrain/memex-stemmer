const urlRegex = require('url-regex') // Check https://mathiasbynens.be/demo/url-regex for results RE: this pattern
const sw = require('remove-stopwords')
import rmDiacritics from './remove-diacritics'

import { DEFAULT_TERM_SEPARATOR } from './constants'
import type { TextTransformer } from './types'

const termSeparator = DEFAULT_TERM_SEPARATOR
const allWhitespacesPattern = /\s+/g
const nonWordsPattern = /[\u2000-\u206F\u2E00-\u2E7F\\!"#$%&()*+,./:;<=>?[\]^_`{|}~«»。（）ㅇ©ºø°]/gi
const apostrophePattern = /['’]/g
const wantedDashPattern = /(\S+)-(\S+)/g
const unwantedDashPattern = /\s+-\s+/g
const unwantedDashPattern1 = /(\S+)-(\S+)/g
const longWords = /\b\w{30,}\b/gi
const singleCharacters = /(?<!\S).(?!\S)\s*/
const randomDigits = /\b(\d{1,3}|\d{5,})\b/gi
const urlPattern = urlRegex()

const removeUrls = (text = '') => text.replace(urlPattern, ' ')

const removePunctuation = (text = '') => text.replace(nonWordsPattern, ' ')

const cleanupWhitespaces = (text = '') =>
    text.replace(allWhitespacesPattern, ' ').trim()

/**
 * Split string into strings of words, then remove duplicates (using `Set` constructor).
 *
 * @param {string} [text=''] Input string
 * @param {string|RegExp} [wordDelim=' '] Delimiter to split `input` into words.
 * @returns {string} Version of `text` param without duplicate words.
 */
export const removeDupeWords = (text = '') =>
    [...new Set(text.split(termSeparator))].join(' ')

const removeUselessWords = (text = '', lang) => {
    const oldString = text.split(termSeparator)
    const newString = sw.removeStopwords(oldString, lang)
    return newString.join(' ')
}

const combinePunctuation = (text = '') => text.replace(apostrophePattern, '')

// Extract individual words from any words-connected-by-dashes
const splitDashes = (text = '') => {
    const matches = text.match(wantedDashPattern)

    if (matches == null) {
        return text.replace(unwantedDashPattern, ' ')
    }

    // Split up dash-words, deriving new words to add to the text
    const newWords = matches
        .map((match) => match.split('-'))
        .reduce((a, b) => [...a, ...b])
        .join(' ')

    // Ensure to remove any other dash/hyphens in the text that don't connect words (have spaces around)
    return `${text} ${newWords}`.replace(unwantedDashPattern, ' ')
}

const removeDiacritics = (text = '') => {
    return rmDiacritics(text)
}

const removeRandomDigits = (text = '') => text.replace(randomDigits, ' ')

const removeLongWords = (text = '') => text.replace(longWords, ' ')
const removeSingleCharacters = (text = '') =>
    text.replace(singleCharacters, ' ')

/**
 * Takes in some text content and strips it of unneeded data. Currently does
 * puncation (although includes accented characters), numbers, and whitespace.
 */
export const transformPageText: TextTransformer = (
    text,
    { lang = 'en-US' },
) => {
    // Short circuit if no text
    if (!text.trim().length) {
        return { text, lenAfter: 0, lenBefore: 0 }
    }

    // Difference between browser and Node.js, so use .call() to supress type error
    let searchableText = text.toLocaleLowerCase.call(text, lang)

    // Remove URLs first before we start messing with things
    searchableText = removeUrls(searchableText)

    // Removes ' from words effectively combining them
    // Example O'Grady => OGrady
    searchableText = combinePunctuation(searchableText)

    // Splits words with - into separate words
    // Example "chevron-right": "chevron right chevron-right"
    searchableText = splitDashes(searchableText)

    // replaces remaining dashes
    searchableText = searchableText.replace(unwantedDashPattern, ' ')
    searchableText = searchableText.replace(unwantedDashPattern1, ' ')

    // Changes accented characters to regular letters
    searchableText = removeDiacritics(searchableText)

    searchableText = removePunctuation(searchableText)

    searchableText = removeDupeWords(searchableText)

    // Removes all single digits and digits over 5+ characters
    searchableText = removeRandomDigits(searchableText)

    // Removes 'stopwords' such as they'll, don't, however ect..
    // searchableText = removeUselessWords(searchableText, lang)

    // Removes 'stopwords' such as they'll, don't, however ect..
    // searchableText = removeUselessWords(searchableText, lang)

    // Removes all words 20+ characters long
    // searchableText = removeLongWords(searchableText)
    searchableText = removeSingleCharacters(searchableText)

    // We don't care about non-single-space whitespace (' ' is cool)
    searchableText = cleanupWhitespaces(searchableText)

    return {
        text: searchableText,
        lenBefore: text.length,
        lenAfter: searchableText.length,
    }
}

export const transformListName: TextTransformer = (text) => {
    // Short circuit if no text
    if (!text.trim().length) {
        return { text, lenAfter: 0, lenBefore: 0 }
    }

    let searchableName = text.toLocaleLowerCase()

    // Removes ' from words effectively combining them
    // Example O'Grady => OGrady
    searchableName = combinePunctuation(searchableName)

    // Splits words with - into separate words
    // Example "chevron-right": "chevron right chevron-right"
    searchableName = splitDashes(searchableName)

    // Changes accented characters to regular letters
    searchableName = removeDiacritics(searchableName)

    searchableName = removeDupeWords(searchableName)

    // We don't care about non-single-space whitespace (' ' is cool)
    searchableName = cleanupWhitespaces(searchableName)

    return {
        text: searchableName,
        lenBefore: text.length,
        lenAfter: searchableName.length,
    }
}
