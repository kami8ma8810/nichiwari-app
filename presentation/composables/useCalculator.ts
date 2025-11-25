import type { CalculationResult } from '#root/types'
import { CalculateDailyCostUseCase } from '#root/application/use-cases/CalculateDailyCostUseCase'
import { Years } from '#root/domain/value-objects/Years'

interface CalculateParams {
  name?: string
  price: number
  years: number
  months: number
}

export function useCalculator() {
  const calculationResult = ref<CalculationResult | null>(null)
  const isCalculating = ref(false)
  const error = ref<string | null>(null)

  const useCase = new CalculateDailyCostUseCase()

  async function calculate(params: CalculateParams): Promise<void> {
    isCalculating.value = true
    error.value = null

    try {
      const output = useCase.execute({
        products: [{
          name: params.name || '商品',
          price: params.price,
          years: params.years,
          months: params.months,
        }],
      })

      // 使用期間のフォーマット
      const period = Years.fromYearsAndMonths(params.years, params.months)

      calculationResult.value = {
        dailyCost: output.totalDailyCost,
        dailyCostFormatted: output.dailyCostFormatted,
        monthlyCost: output.monthlyCost,
        yearlyCost: output.yearlyCost,
        productName: params.name,
        price: params.price,
        years: params.years,
        months: params.months,
        periodFormatted: period.format(),
      }
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : '計算中にエラーが発生しました'
      calculationResult.value = null
    }
    finally {
      isCalculating.value = false
    }
  }

  function reset(): void {
    calculationResult.value = null
    error.value = null
  }

  return {
    calculationResult: readonly(calculationResult),
    isCalculating: readonly(isCalculating),
    error: readonly(error),
    calculate,
    reset,
  }
}
