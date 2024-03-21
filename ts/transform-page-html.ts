import { load } from 'cheerio'
import type { TransformedText } from './types'
import {
    transformPageHTML as _transformPageHTML,
    TEXT_EXTRACT_EL,
} from './transform-page-html.common'

export const transformPageHTML = ({
    html = '',
}: {
    html?: string
}): TransformedText =>
    _transformPageHTML({
        html,
        performDOMManipulation: (html) => {
            let text = `<${TEXT_EXTRACT_EL}>${html}</${TEXT_EXTRACT_EL}>`
            const $ = load(text, { decodeEntities: false })
            $('script').remove()
            $('noscript').remove()
            $('svg').remove()
            $('select').remove()

            // Remove style only after removing hidden elements
            $('style').remove()
            return $(TEXT_EXTRACT_EL).text()
        },
    })
