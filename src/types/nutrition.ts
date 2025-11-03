import { z } from 'zod'
export const nutritionItemSchema = z.object({
id: z.number().optional(),
name: z.string().min(1),
category: z.string().default('Main'),
kcal: z.number().nonnegative(),
fat_g: z.number().nonnegative(),
sat_fat_g: z.number().nonnegative(),
carbs_g: z.number().nonnegative(),
sugar_g: z.number().nonnegative(),
protein_g: z.number().nonnegative(),
salt_g: z.number().nonnegative(),
fiber_g: z.number().nonnegative(),
allergens: z.string().default(''),
position: z.number().int().nonnegative().default(0),
})
export type NutritionItem = z.infer<typeof nutritionItemSchema>