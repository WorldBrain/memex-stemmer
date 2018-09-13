import { DEFAULT_TERM_SEPARATOR } from './constants'

// import normalizeUrl from '../util/encode-url-for-id'
import transformPageText from './transform-page-text'
/**
 * @returns Set of "words-of-interest" - determined by pre-proc logic in `transformPageText` - extracted from `text`.
 */
export default function extractTerms(text: string): Set<string> {
    if (!text || !text.length) {
        return new Set()
    }

    const { text: transformedText } = transformPageText({ text })

    if (!transformedText || !transformedText.length) {
        return new Set()
    }

    return new Set(
        extractContent(transformedText, {
            separator: DEFAULT_TERM_SEPARATOR,
        }),
    )
}

/**
 * Handles splitting up searchable content into indexable terms. Terms are all
 * lowercased.
 *
 * @param {string} content Searchable content text.
 * @param {string|RegExp} [separator=' '] Separator used to split content into terms.
 * @returns {string[]} Array of terms derived from `content`.
 */
export const extractContent = (
    content,
    { separator = DEFAULT_TERM_SEPARATOR },
) =>
    content
        .split(separator)
        .map(word => word.toLowerCase())
        .filter(term => term.length)
