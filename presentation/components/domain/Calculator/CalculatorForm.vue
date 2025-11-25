<script setup lang="ts">
import type { CalculatorFormData } from '#root/types'
import * as v from 'valibot'

const emit = defineEmits<{
  calculate: [
    data: { name?: string, price: number, years: number, months: number },
  ]
}>()

// バリデーションスキーマ
const FormSchema = v.object({
  name: v.optional(
    v.pipe(v.string(), v.maxLength(100, '100文字以内で入力してください')),
  ),
  price: v.pipe(
    v.number(),
    v.minValue(1, '1円以上で入力してください'),
    v.maxValue(1000000000, '10億円以下で入力してください'),
  ),
  years: v.pipe(
    v.number(),
    v.minValue(0, '0以上で入力してください'),
    v.maxValue(100, '100以下で入力してください'),
    v.integer('整数で入力してください'),
  ),
  months: v.pipe(
    v.number(),
    v.minValue(0, '0以上で入力してください'),
    v.maxValue(11, '11以下で入力してください'),
    v.integer('整数で入力してください'),
  ),
})

const formData = reactive<CalculatorFormData>({
  name: '',
  price: null,
  years: null,
  months: null,
})

const errors = reactive<Record<string, string>>({})
const isCalculating = ref(false)

function validate() {
  // 年と月の両方が0の場合をチェック
  if (formData.years === 0 && formData.months === 0) {
    errors.years = '使用期間は1ヶ月以上である必要があります'
    return null
  }

  try {
    const parsed = v.parse(FormSchema, {
      name: formData.name || undefined,
      price: formData.price,
      years: formData.years ?? 0,
      months: formData.months ?? 0,
    })
    // エラーをクリア
    Object.keys(errors).forEach(key => delete errors[key])
    return parsed
  }
  catch (error) {
    if (v.isValiError(error)) {
      error.issues.forEach((issue) => {
        if (issue.path) {
          const key = issue.path[0].key as string
          errors[key] = issue.message
        }
      })
    }
    return null
  }
}

async function handleSubmit() {
  const validated = validate()
  if (!validated)
    return

  isCalculating.value = true

  // 計算処理をエミット
  emit('calculate', {
    name: validated.name,
    price: validated.price,
    years: validated.years,
    months: validated.months,
  })

  setTimeout(() => {
    isCalculating.value = false
  }, 500)
}

function reset() {
  formData.name = ''
  formData.price = null
  formData.years = null
  formData.months = null
  Object.keys(errors).forEach(key => delete errors[key])
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl p-8">
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- 商品名入力 -->
      <div>
        <label
          for="product-name"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          商品名・買う物（任意）
        </label>
        <input
          id="product-name"
          v-model="formData.name"
          type="text"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="例：iPhone 15 Pro"
          :aria-invalid="!!errors.name"
          :aria-describedby="errors.name ? 'name-error' : undefined"
        >
        <div aria-live="polite" aria-atomic="true">
          <p
            v-if="errors.name"
            id="name-error"
            class="mt-2 text-sm text-red-600"
            role="alert"
          >
            {{ errors.name }}
          </p>
        </div>
      </div>

      <!-- 価格入力 -->
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
          購入価格 <span class="text-red-500" aria-label="必須">*</span>
        </label>
        <div class="relative">
          <span
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          >
            ¥
          </span>
          <input
            id="price"
            v-model.number="formData.price"
            type="number"
            required
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="150000"
            min="1"
            max="1000000000"
            :aria-invalid="!!errors.price"
            :aria-describedby="errors.price ? 'price-error' : undefined"
          >
        </div>
        <div aria-live="polite" aria-atomic="true">
          <p
            v-if="errors.price"
            id="price-error"
            class="mt-2 text-sm text-red-600"
            role="alert"
          >
            {{ errors.price }}
          </p>
        </div>
      </div>

      <!-- 使用期間入力（年と月） -->
      <fieldset>
        <legend class="block text-sm font-medium text-gray-700 mb-2">
          使用予定期間 <span class="text-red-500" aria-label="必須">*</span>
        </legend>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <input
              id="years"
              v-model.number="formData.years"
              type="number"
              class="w-20 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="3"
              min="0"
              max="100"
              :aria-invalid="!!errors.years"
              :aria-describedby="errors.years ? 'years-error' : undefined"
            >
            <label for="years" class="text-gray-500">年</label>
          </div>
          <div class="flex items-center gap-2">
            <input
              id="months"
              v-model.number="formData.months"
              type="number"
              class="w-20 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="0"
              min="0"
              max="11"
              :aria-invalid="!!errors.months"
              :aria-describedby="errors.months ? 'months-error' : undefined"
            >
            <label for="months" class="text-gray-500">ヶ月</label>
          </div>
        </div>
        <div aria-live="polite" aria-atomic="true">
          <p
            v-if="errors.years"
            id="years-error"
            class="mt-2 text-sm text-red-600"
            role="alert"
          >
            {{ errors.years }}
          </p>
          <p
            v-if="errors.months"
            id="months-error"
            class="mt-2 text-sm text-red-600"
            role="alert"
          >
            {{ errors.months }}
          </p>
        </div>
      </fieldset>

      <!-- ボタン -->
      <div class="flex gap-4 pt-6">
        <button
          type="button"
          class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-bold cursor-pointer"
          @click="reset"
        >
          リセット
        </button>
        <button
          type="submit"
          :disabled="isCalculating"
          class="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-lg disabled:opacity-50 cursor-pointer"
        >
          <span v-if="!isCalculating" class="font-bold">計算する</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg
              class="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            計算中...
          </span>
        </button>
      </div>
    </form>
  </div>
</template>
