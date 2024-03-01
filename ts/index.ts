import { DEFAULT_TERM_SEPARATOR } from './constants'

import { transformPageText, transformListName } from './transform-page-text'
import type { TextTransformer } from './types'

const initStemmer = (
    textTransformer: TextTransformer,
    separator?: string | RegExp,
) => (text: string): Set<string> => {
    if (!text?.length) {
        return new Set()
    }

    const { text: transformedText } = textTransformer(text, {})

    if (!transformedText?.length) {
        return new Set()
    }

    return new Set(
        extractContent(transformedText, {
            separator: separator ?? DEFAULT_TERM_SEPARATOR,
        }),
    )
}

export default initStemmer(transformPageText)
export const listNameStemmer = initStemmer(transformListName)

/**
 * Handles splitting up searchable content into indexable terms. Terms are all
 * lowercased.
 */
export const extractContent = (
    content: string,
    { separator = DEFAULT_TERM_SEPARATOR }: { separator: string | RegExp },
): string[] =>
    content
        .split(separator)
        .map((word) => word.toLowerCase())
        .filter((term) => term.length)
