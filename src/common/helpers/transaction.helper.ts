import { TransformFnParams } from 'class-transformer'
import Decimal from 'decimal.js'

export const calculatedProcessingFee = (amount: number): number => {
  switch (true) {
    case amount <= 1000:
      return 10
    case amount <= 10000 && amount > 1000:
      return 25
    default:
      return 50
  }
}

export const calculatedStripeFee = (amount: number, country?: string) => {
  switch (country) {
    case 'sgd':
      return amount * 0.034 + 50
    default:
      return amount * 0.039 + 50
  }
}

export const DecimalToString =
  (decimals: number = 2) =>
  (params: TransformFnParams): string | undefined => {
    const value = params.value as Decimal | undefined
    return value?.toFixed?.(decimals) || undefined
  }
