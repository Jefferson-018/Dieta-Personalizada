// src/hooks/useDietCalculator.ts
import { useState } from 'react';
import { foodDatabase, workoutDatabase, activityFactors } from '../data/database';
import { UserData, DietResult, FoodItem, Meal } from '../types';

export const useDietCalculator = () => {
  const [result, setResult] = useState<DietResult | null>(null);

  const pick = (list: FoodItem[]): FoodItem => {
      if (!list || list.length === 0) return { name: "Opção Padrão", calories: 0, displayPortion: "À vontade" }; 
      return list[Math.floor(Math.random() * list.length)];
  };

  const getFood = (tag: string, selectedIds: number[]): FoodItem => {
      const allOptions = foodDatabase.filter(f => f.tags?.includes(tag));
      const favorites = allOptions.filter(f => f.id && selectedIds.includes(f.id));
      return pick(favorites.length > 0 ? favorites : allOptions);
  };

  const calculate = (userData: UserData, selectedFoods: number[] = []) => {
    const weight = Number(userData.weight) || 70;
    const height = Number(userData.height) || 170;
    const age = Number(userData.age) || 25;

    let bmr = userData.sex === 'male' 
        ? (10 * weight) + (6.25 * height) - (5 * age) + 5
        : (10 * weight) + (6.25 * height) - (5 * age) - 161;
    
    let tdee = bmr * (activityFactors[userData.activityLevel] || 1.55);
    let finalCals = userData.goal === 'mass' ? tdee * 1.15 : userData.goal === 'loss' ? tdee * 0.85 : tdee;
    
    finalCals = Math.round(finalCals);

    const createMeal = (name: string, time: string, calPct: number, itemsTemplate: any[]): Meal => {
        const targetCals = Math.round(finalCals * calPct);
        const items = itemsTemplate.map(template => {
            const food = typeof template.tag === 'string' 
                ? getFood(template.tag, selectedFoods) 
                : template;
            return { ...food, obs: template.obs, displayPortion: "Calculando..." }; 
        });

        const caloricItems = items.filter(i => i.calories > 0);
        const calPerItem = targetCals / (caloricItems.length || 1);
        
        items.forEach(item => {
            if (item.calories > 0) {
                const grams = Math.round((calPerItem / item.calories) * 100);
                
                if (item.name.includes("Ovo") || item.name.includes("Pão") || item.name.includes("Fruta") || item.name.includes("Tapioca")) {
                   const unit = Math.max(1, Math.round(grams / 50)); 
                   item.displayPortion = `${unit} unid/fatias (${grams}g)`;
                } else if (item.name.includes("Pasta de Amendoim") || item.name.includes("Requeijão")) {
                   item.displayPortion = "1 colher de sopa";
                } else if (item.name.includes("Whey")) {
                   item.displayPortion = "1 dose (30g)";
                } else {
                    item.displayPortion = `${grams}g (cozido)`;
                }
            } else {
                item.displayPortion = "À vontade";
            }
        });

        return { name, time, calories: targetCals, items };
    };

    const meals: Meal[] = [
        createMeal("Café da Manhã", "07:30", 0.25, [
            { tag: 'carb_breakfast', obs: "Fonte de Energia" }, // Pão/Aveia
            { tag: 'protein_breakfast', obs: "Proteína" },
            { tag: 'fruit', obs: "Vitaminas" }
        ]),
        createMeal("Almoço", "12:30", 0.35, [
            { tag: 'carb_lunch', obs: "Carboidrato" }, // Arroz/Feijão
            { tag: 'bean', obs: "Leguminosa" },
            { tag: 'protein_lunch', obs: "Proteína Magra" },
            { name: "Salada Colorida", calories: 0, obs: "Fibras (Obrigatório)" }
        ]),
        createMeal("Lanche da Tarde", "16:00", 0.15, [
            { tag: 'snack', obs: "Proteico/Lácteo" }, 
            { tag: 'fruit', obs: "Antioxidantes" }
        ]),
        createMeal("Jantar", "20:00", 0.25, [
            { tag: 'carb_lunch', obs: "Porção Reduzida" },
            { tag: 'protein_lunch', obs: "Foco em Proteína" },
            { name: "Vegetais Cozidos", calories: 30, obs: "Saciedade sem peso" }
        ])
    ];

    const workoutPlan = [workoutDatabase.push, workoutDatabase.pull, workoutDatabase.legs];

    const data: DietResult = {
        calories: finalCals,
        macros: {
            p: Math.round(weight * 2),
            c: Math.round((finalCals - (weight*2*4) - (weight*0.8*9)) / 4),
            f: Math.round(weight * 0.8)
        },
        meals,
        workoutPlan
    };

    setResult(data);
  };

  return { calculate, result };
};