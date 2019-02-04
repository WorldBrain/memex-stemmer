/* eslint-env jest */
const expect = require('expect')
import extractTerms from './'
const DATA = require('./index.test.data')

function testExtractTerms({ input, output = DATA.EXPECTED_TERMS }) {
    const result = extractTerms(input)

    expect(result).toEqual(new Set(output))
}

describe('Search index pipeline', () => {
    it('should extract terms', () => {
        testExtractTerms({
            input: 'very often the people forget to optimize important code',
        })
    })

    it('should extract terms removing URLs', () => {
        testExtractTerms({
            input:
                'very often the people (https://thepeople.com) forget to optimize important code',
        })
    })

    it('should extract terms combining punctuation', () => {
        testExtractTerms({
            input: "very often people's forget to optimize important code",
            output: ['peoples', 'forget', 'optimize', 'important', 'code'],
        })
    })

    it('should extract terms removing diacritics', () => {
        testExtractTerms({
            input: 'very often the péople forget to óptimize important code',
        })
    })

    it('should extract terms normalizing weird spaces', () => {
        testExtractTerms({
            input:
                'very often\u{2007}the people\u{202F}forget to optimize important\u{A0}code',
        })
    })

    it('should extract terms _including_ words with numbers', () => {
        testExtractTerms({
            input:
                'very often the people (like Punkdude123) forget to optimize important code',
            output: [...DATA.EXPECTED_TERMS, 'punkdude123'],
        })
    })

    it('should extract terms _including_ emails', () => {
        testExtractTerms({
            input:
                'very often the people (punkdude123@gmail.com) forget to optimize important code',
            output: [...DATA.EXPECTED_TERMS, 'punkdude123@gmail'],
        })
    })

    // https://xkcd.com/37
    it('should extract terms _including_ words found in "dash-words"', () => {
        testExtractTerms({
            input:
                'very often the people forget to optimize important-ass code, important-ass-code, and important ass-code',
            output: [
                ...DATA.EXPECTED_TERMS,
                'important-ass-code',
                'important-ass',
                'ass-code',
                'ass',
            ],
        })
    })

    it('should extract terms ignoring - spaced - hyphens', () => {
        testExtractTerms({
            input:
                'very   -   often -   the - people forget - to - optimize important code',
            output: DATA.EXPECTED_TERMS,
        })
    })

    it('should extract terms removing useless whitespace', () => {
        testExtractTerms({
            input: 'very often the people forget to optimize important code',
        })
    })

    it('should extract terms removing random digits', () => {
        testExtractTerms({
            input: 'very often the 5 people forget to optimize important code',
        })
        testExtractTerms({
            input:
                'very often the 555 people forget to optimize important code',
        })
        testExtractTerms({
            input:
                'very often the 5555 people forget to optimize important code',
            output: [
                '5555',
                'people',
                'forget',
                'optimize',
                'important',
                'code',
            ],
        })
        testExtractTerms({
            input:
                'very often the 555555 people forget to optimize important code',
        })
    })

    it('should extract terms removing long words', () => {
        testExtractTerms({
            input:
                'very often the hippopotomonstrosesquippedaliophobic people forget to optimize important code',
        })
    })

    it('should extract terms _including_ words with many consonants', () => {
        testExtractTerms({
            input:
                'very often the people from Vrchlabí forget to optimize important code',
            output: [...DATA.EXPECTED_TERMS, 'vrchlabi'],
        })
    })

    it('should extract terms removing duplicate words', () => {
        testExtractTerms({
            input:
                'very often the people forget to people optimize important code',
        })
    })
})
