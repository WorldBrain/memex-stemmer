import { load } from 'cheerio'
import type { TransformedText } from './types'
import { transformPageHTML as _transformPageHTML } from './transform-page-html.common'

export const transformPageHTML = ({
    html = '',
}: {
    html?: string
}): TransformedText =>
    _transformPageHTML({
        html,
        performDOMManipulation: (html) => {
            let text = `<textractwrapper>${html}<textractwrapper>`
            const $ = load(text, { decodeEntities: false })
            $('script').remove()
            $('noscript').remove()
            $('svg').remove()
            $('select').remove()

            // Remove style only after removing hidden elements
            $('style').remove()
            return $('textractwrapper').text()
        },
    })
