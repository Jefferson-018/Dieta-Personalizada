// src/data/database.ts
import { FoodItem, WorkoutSession } from '../types';

export const foodDatabase: FoodItem[] = [
    // --- PROTEÍNAS (ALMOÇO/JANTAR) ---
    {id:1, name:"Peito de Frango Grelhado", calories:165, macros:{P:31,C:0,G:3.6}, tags:['protein_lunch']},
    {id:2, name:"Carne Moída (Patinho)", calories:220, macros:{P:26,C:0,G:12}, tags:['protein_lunch']},
    {id:3, name:"Filé de Tilápia/Peixe", calories:100, macros:{P:20,C:0,G:1.7}, tags:['protein_lunch']},
    {id:4, name:"Bife Acebolado (Alcatra)", calories:200, macros:{P:28,C:0,G:9}, tags:['protein_lunch']},
    {id:5, name:"Omelete de Forno (3 Ovos)", calories:220, macros:{P:18,C:2,G:15}, tags:['protein_lunch', 'protein_breakfast']},

    // --- CARBOIDRATOS (ALMOÇO/JANTAR - AQUI FICA O ARROZ) ---
    {id:10, name:"Arroz Branco", calories:130, macros:{P:2.5,C:28,G:0.2}, tags:['carb_lunch']},
    {id:11, name:"Arroz Integral", calories:110, macros:{P:2.6,C:23,G:1}, tags:['carb_lunch']},
    {id:12, name:"Batata Doce Cozida", calories:86, macros:{P:1.6,C:20,G:0.1}, tags:['carb_lunch']},
    {id:13, name:"Purê de Mandioquinha", calories:110, macros:{P:1,C:26,G:0.2}, tags:['carb_lunch']},
    {id:14, name:"Macarrão Integral", calories:124, macros:{P:5,C:26,G:0.5}, tags:['carb_lunch']},
    {id:15, name:"Feijão Carioca (Concha)", calories:76, macros:{P:5,C:14,G:0.5}, tags:['bean']},
    {id:16, name:"Lentilha", calories:116, macros:{P:9,C:20,G:0.4}, tags:['bean']},

    // --- CARBOIDRATOS (CAFÉ DA MANHÃ - SÓ PÃES E CEREAIS) ---
    {id:20, name:"Pão Francês", calories:135, macros:{P:4,C:28,G:0.5}, tags:['carb_breakfast']},
    {id:21, name:"Pão Integral (Fatias)", calories:120, macros:{P:6,C:22,G:2}, tags:['carb_breakfast']},
    {id:22, name:"Tapioca (Goma)", calories:130, macros:{P:0,C:32,G:0}, tags:['carb_breakfast']},
    {id:23, name:"Aveia em Flocos", calories:110, macros:{P:4,C:17,G:2}, tags:['carb_breakfast']},
    {id:24, name:"Cuscuz de Milho", calories:112, macros:{P:2,C:23,G:0}, tags:['carb_breakfast']},
    {id:25, name:"Granola sem Açúcar", calories:160, macros:{P:4,C:25,G:5}, tags:['carb_breakfast']},

    // --- PROTEÍNAS/ACOMPANHAMENTOS (CAFÉ) ---
    {id:30, name:"Ovos Mexidos", calories:140, macros:{P:12,C:1,G:10}, tags:['protein_breakfast']},
    {id:31, name:"Queijo Minas Frescal", calories:80, macros:{P:8,C:1,G:5}, tags:['protein_breakfast']},
    {id:32, name:"Requeijão Light", calories:40, macros:{P:3,C:1,G:3}, tags:['protein_breakfast']},
    {id:33, name:"Frango Desfiado", calories:100, macros:{P:20,C:0,G:2}, tags:['protein_breakfast']},
    {id:34, name:"Pasta de Amendoim", calories:90, macros:{P:4,C:3,G:8}, tags:['fat_breakfast']},

    // --- FRUTAS E LANCHES ---
    {id:40, name:"Banana Prata", calories:90, tags:['fruit']},
    {id:41, name:"Maçã Fuji", calories:60, tags:['fruit']},
    {id:42, name:"Mamão Papaia", calories:50, tags:['fruit']},
    {id:43, name:"Abacaxi (Fatias)", calories:50, tags:['fruit']},
    {id:44, name:"Morangos", calories:30, tags:['fruit']},
    {id:45, name:"Iogurte Natural", calories:70, tags:['snack']},
    {id:46, name:"Whey Protein", calories:120, tags:['snack']}
];

export const workoutDatabase: Record<string, WorkoutSession> = {
    push: {
        title: "Treino A: Peito, Ombros e Tríceps",
        exercises: [
            { name: "Supino Reto (Barra ou Halter)", sets: "4x 8-12" },
            { name: "Supino Inclinado", sets: "3x 10-12" },
            { name: "Desenvolvimento Militar", sets: "3x 10-12" },
            { name: "Elevação Lateral", sets: "4x 12-15" },
            { name: "Tríceps Corda (Polia)", sets: "4x 12-15" }
        ]
    },
    pull: {
        title: "Treino B: Costas, Bíceps e Trapézio",
        exercises: [
            { name: "Puxada Alta (Aberta)", sets: "4x 10-12" },
            { name: "Remada Curvada", sets: "4x 8-10" },
            { name: "Serrote Unilateral", sets: "3x 12" },
            { name: "Rosca Direta", sets: "4x 10-12" },
            { name: "Encolhimento de Ombros", sets: "4x 15" }
        ]
    },
    legs: {
        title: "Treino C: Pernas Completas",
        exercises: [
            { name: "Agachamento Livre", sets: "4x 8-10" },
            { name: "Leg Press 45º", sets: "4x 10-12" },
            { name: "Cadeira Extensora", sets: "3x 15 (até falhar)" },
            { name: "Mesa Flexora", sets: "4x 12" },
            { name: "Panturrilhas em Pé", sets: "5x 15-20" }
        ]
    }
};

export const activityFactors: Record<string, number> = {
    sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9
};