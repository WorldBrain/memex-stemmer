import { parseHTML } from 'linkedom/worker'
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
            const { document: doc } = parseHTML(
                `<${TEXT_EXTRACT_EL}>${html}</${TEXT_EXTRACT_EL}>`,
            )

            const removeEl = (el: any) => el.remove()
            doc.querySelectorAll('script').forEach(removeEl)
            doc.querySelectorAll('noscript').forEach(removeEl)
            doc.querySelectorAll('svg').forEach(removeEl)
            doc.querySelectorAll('select').forEach(removeEl)
            doc.querySelectorAll('style').forEach(removeEl)
            const textContent =
                doc.querySelector(TEXT_EXTRACT_EL)?.textContent ?? ''

            return textContent
        },
    })
