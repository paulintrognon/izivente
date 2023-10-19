import * as crypto from 'crypto'

export enum CharsetEnum {
  Numeric,
  AlphaUppercase,
  AlphaLowercase,
  AlphaNumeric,
  AlphaNumericUppercase,
}

const NUMERIC_CHARSET = '0123456789'
const ALPHA_UPPERCASE_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ALPHA_LOWERCASE_CHARSET = ALPHA_UPPERCASE_CHARSET.toLowerCase()
const ALPHA_NUMERIC_CHARSET = `${NUMERIC_CHARSET}${ALPHA_UPPERCASE_CHARSET}${ALPHA_LOWERCASE_CHARSET}`
const ALPHA_NUMERIC_UPPERCASE_CHARSET = `${NUMERIC_CHARSET}${ALPHA_UPPERCASE_CHARSET}`

const characterSets = {
  [CharsetEnum.Numeric]: NUMERIC_CHARSET,
  [CharsetEnum.AlphaUppercase]: ALPHA_UPPERCASE_CHARSET,
  [CharsetEnum.AlphaLowercase]: ALPHA_LOWERCASE_CHARSET,
  [CharsetEnum.AlphaNumeric]: ALPHA_NUMERIC_CHARSET,
  [CharsetEnum.AlphaNumericUppercase]: ALPHA_NUMERIC_UPPERCASE_CHARSET,
}

/**
 * Generate a random text using crypto
 * Can be given a specific set or a custom set
 */
export function randomText(
  length: number,
  charactersSet: string | CharsetEnum = CharsetEnum.AlphaNumeric
) {
  const characters: string[] =
    typeof charactersSet === 'string'
      ? charactersSet.split('')
      : characterSets[charactersSet].split('')

  // Generating entropy is faster than complex math operations, so we use the simplest way
  const characterCount = characters.length
  const maxValidSelector = Math.floor(0x10000 / characterCount) * characterCount - 1 // Using values above this will ruin distribution when using modular division
  const entropyLength = 2 * Math.ceil(1.1 * length) // Generating a bit more than required so chances we need more than one pass will be really low
  let string = ''
  let stringLength = 0

  while (stringLength < length) {
    // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
    const entropy = crypto.randomBytes(entropyLength)
    let entropyPosition = 0

    while (entropyPosition < entropyLength && stringLength < length) {
      const entropyValue = entropy.readUInt16LE(entropyPosition)
      entropyPosition += 2
      if (entropyValue > maxValidSelector) {
        // Skip values which will ruin distribution when using modular division
        continue
      }

      string += characters[entropyValue % characterCount]
      stringLength++
    }
  }

  return string
}
