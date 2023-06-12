export type TextTransformer = (
    text: string,
    args?: { lang?: string },
) => TransformedText

export interface TransformedText {
    text: string
    lenAfter: number
    lenBefore: number
}
