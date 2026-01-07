// src/App.tsx
import React, { useState } from 'react';
import { useDietCalculator } from './hooks/useDietCalculator';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard'; // <--- NOVO
import { generatePDF } from './utils/generatePDF'; 
import { db } from './services/firebase'; // <--- NOVO
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // <--- NOVO
import { foodDatabase } from './data/database';
import { Activity, ChevronRight, ChevronLeft, Flame, Dumbbell, Utensils, RefreshCw, Trophy, Check, BrainCircuit, LogOut, AlertCircle, ShoppingCart, Save } from 'lucide-react';
import { UserData } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'calculator'>('dashboard'); // Controla a tela
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Loading do salvamento
  const [processingStep, setProcessingStep] = useState(0);
  
  const [step, setStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'diet' | 'workout'>('diet');
  const [selectedFoods, setSelectedFoods] = useState<number[]>([]);

  const [userData, setUserData] = useState<UserData>({ 
      name: '', goal: 'loss', weight: '', height: '', age: '', sex: 'male', activityLevel: 'moderate' 
  });

  const { calculate, result } = useDietCalculator();

  const toggleFood = (id: number) => {
      setSelectedFoods(prev => 
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
  };

  const handleCalculate = () => {
    setIsProcessing(true);
    const steps = ["Processando Preferências...", "Ajustando Calorias...", "Montando Cardápio...", "Finalizando Protocolo..."];
    steps.forEach((_, index) => { setTimeout(() => { setProcessingStep(index); }, index * 800); });
    
    setTimeout(() => {
        calculate(userData, selectedFoods);
        setIsProcessing(false);
        setStep(4);
        setProcessingStep(0);
    }, 3200);
  };

  // FUNÇÃO DE SALVAR NO FIREBASE
  const handleSaveDiet = async () => {
      if (!result) return;
      setIsSaving(true);
      try {
          await addDoc(collection(db, "diets"), {
              userData,
              result,
              selectedFoods,
              createdAt: serverTimestamp()
          });
          alert("Paciente salvo com sucesso!");
          setCurrentView('dashboard'); // Volta pro painel
          setStep(1); // Reseta a calculadora
          setUserData({ name: '', goal: 'loss', weight: '', height: '', age: '', sex: 'male', activityLevel: 'moderate' });
          setSelectedFoods([]);
      } catch (e) {
          console.error("Erro ao salvar", e);
          alert("Erro ao salvar. Tente novamente.");
      } finally {
          setIsSaving(false);
      }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (key: keyof UserData, value: any) => {
    setUserData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => { 
      if (step === 2) {
         if (!userData.name || !userData.weight || !userData.height || !userData.age) {
            alert("Preencha todos os dados para continuar.");
            return;
         }
      }
      if (step === 3) handleCalculate(); 
      else setStep(prev => prev + 1); 
  };
  
  const prevStep = () => setStep(prev => prev - 1);
  const handleLogout = () => { setIsAuthenticated(false); setStep(1); setSelectedFoods([]); };

  const foodCategories = {
      "Café da Manhã (Pães/Cereais)": foodDatabase.filter(f => f.tags?.includes('carb_breakfast')),
      "Acompanhamentos Café": foodDatabase.filter(f => f.tags?.includes('protein_breakfast') || f.tags?.includes('fat_breakfast')),
      "Almoço/Jantar (Carboidratos)": foodDatabase.filter(f => f.tags?.includes('carb_lunch')),
      "Almoço/Jantar (Proteínas)": foodDatabase.filter(f => f.tags?.includes('protein_lunch')),
      "Frutas e Lanches": foodDatabase.filter(f => f.tags?.includes('fruit') || f.tags?.includes('snack'))
  };

  // 1. LOGIN
  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  // 2. DASHBOARD (PAINEL)
  if (currentView === 'dashboard') {
      return <Dashboard onLogout={handleLogout} onNewDiet={() => setCurrentView('calculator')} />;
  }

  // 3. LOADING CALCULADORA
  if (isProcessing) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-emerald-900 rounded-full"></div>
                <div className="w-24 h-24 border-4 border-t-emerald-500 border-r-emerald-500 border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 animate-pulse" size={40} />
            </div>
            <h2 className="text-white text-xl font-bold mt-8 mb-2">Processando</h2>
            <p className="text-emerald-400 font-mono text-sm">IA analisando perfil...</p>
        </div>
      );
  }

  // 4. CALCULADORA (WIZARD)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500 selection:text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col h-[90vh] md:h-[800px] relative">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
        
        {/* Header */}
        <div className="relative z-10 px-6 pt-8 pb-4 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
            <div>
                <span className="text-xs font-bold tracking-widest text-emerald-500 uppercase">NOVA AVALIAÇÃO</span>
                <h1 className="text-xl font-bold text-white mt-1">
                    {step === 1 && "Defina a Meta"}
                    {step === 2 && "Dados do Aluno"}
                    {step === 3 && "Preferências"}
                    {step === 4 && "Protocolo Gerado"}
                </h1>
            </div>
            <button onClick={() => setCurrentView('dashboard')} aria-label="Voltar ao Painel" className="text-slate-500 hover:text-white text-sm font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">CANCELAR</button>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto p-6 scrollbar-hide">
            {step === 1 && (
                <div className="space-y-4 animate-fade-in-up">
                    {[{ id: 'loss', icon: Flame, title: "Secar Gordura", desc: "Definição máxima (-15%)", color: "from-orange-500 to-red-600" }, { id: 'maintain', icon: Activity, title: "Manutenção", desc: "Saúde e Performance", color: "from-blue-500 to-cyan-500" }, { id: 'mass', icon: Dumbbell, title: "Ganhar Massa", desc: "Volume muscular (+15%)", color: "from-emerald-500 to-green-600" }].map((option) => {
                        const isSelected = userData.goal === option.id;
                        return (
                            <button key={option.id} onClick={() => { handleOptionSelect('goal', option.id); setTimeout(() => setStep(2), 200); }} className={`w-full group relative p-1 rounded-2xl transition-all duration-300 ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}>
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${option.color} transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}></div>
                                <div className="relative bg-slate-800 h-full rounded-xl p-5 flex items-center gap-4 border border-slate-700/50">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center shadow-lg text-white`}><option.icon size={24} /></div>
                                    <div className="text-left flex-1"><h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-300'}`}>{option.title}</h3><p className="text-xs text-slate-500 font-medium">{option.desc}</p></div>
                                    {isSelected && <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-emerald-600"><Check size={14} strokeWidth={4} /></div>}
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}
            
            {step === 2 && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">NOME COMPLETO</label>
                        <input type="text" name="name" value={userData.name} onChange={handleInput} placeholder="Ex: João Silva" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white text-lg font-bold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-slate-800 p-1 rounded-xl border border-slate-700">{['male', 'female'].map(s => (<button key={s} onClick={() => handleOptionSelect('sex', s)} className={`py-3 rounded-lg text-sm font-bold transition-all ${userData.sex === s ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500'}`}>{s === 'male' ? 'Homem' : 'Mulher'}</button>))}</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 ml-1">PESO (KG)</label><input type="number" name="weight" value={userData.weight} onChange={handleInput} placeholder="75" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white text-xl font-bold outline-none" /></div>
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 ml-1">ALTURA (CM)</label><input type="number" name="height" value={userData.height} onChange={handleInput} placeholder="175" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white text-xl font-bold outline-none" /></div>
                    </div>
                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 ml-1">IDADE</label><input type="number" name="age" value={userData.age} onChange={handleInput} placeholder="25" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white text-xl font-bold outline-none" /></div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">NÍVEL DE ATIVIDADE</label>
                        <select name="activityLevel" aria-label="Nível de Atividade" value={userData.activityLevel} onChange={handleInput} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white text-sm font-medium outline-none cursor-pointer">
                            <option value="sedentary">Sedentário</option>
                            <option value="light">Leve</option>
                            <option value="moderate">Moderado</option>
                            <option value="active">Ativo</option>
                        </select>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-8 animate-fade-in-up pb-10">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex gap-3">
                        <div className="text-emerald-400 mt-0.5"><ShoppingCart size={20}/></div>
                        <p className="text-xs text-emerald-200/80 leading-relaxed">Selecione o que o aluno gosta.</p>
                    </div>

                    {Object.entries(foodCategories).map(([categoryName, foods]) => (
                        <div key={categoryName} className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{categoryName}</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {foods.map((food) => {
                                    const isSelected = food.id && selectedFoods.includes(food.id);
                                    return (
                                        <button key={food.id} onClick={() => food.id && toggleFood(food.id)} className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${isSelected ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'}`}>
                                            <span className={`text-sm font-bold block ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>{food.name}</span>
                                            {isSelected && <div className="absolute top-2 right-2 text-emerald-500"><Check size={14} strokeWidth={4} /></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {step === 4 && result && (
                <div className="space-y-6 animate-fade-in-up pb-20">
                     <div className="bg-emerald-600 rounded-3xl p-6 text-center shadow-lg shadow-emerald-500/20">
                        <p className="text-emerald-200 text-sm uppercase font-bold">Meta Diária</p>
                        <h2 className="text-5xl font-black text-white my-2">{result.calories} <span className="text-xl font-normal">kcal</span></h2>
                        <div className="flex justify-center gap-4 text-xs font-bold bg-black/20 py-2 rounded-full mx-auto w-fit px-6">
                            <span>🥩 {result.macros.p}g Prot</span>
                            <span>🍚 {result.macros.c}g Carb</span>
                            <span>💧 {(Number(userData.weight) * 35 / 1000).toFixed(1)}L Água</span>
                        </div>
                    </div>

                    <div className="flex p-1 bg-slate-800/50 rounded-xl border border-slate-700"><button onClick={() => setActiveTab('diet')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'diet' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500'}`}><Utensils size={16} /> Dieta</button><button onClick={() => setActiveTab('workout')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'workout' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500'}`}><Dumbbell size={16} /> Treino</button></div>
                    
                    {activeTab === 'diet' && (
                        <div className="space-y-4">
                            {result.meals.map((meal, idx) => (
                                <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                                    <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-emerald-400 text-xs font-bold">{meal.time.split(':')[0]}h</div><span className="font-bold text-white">{meal.name}</span></div><span className="text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded-md border border-slate-700">{meal.calories} kcal</span></div>
                                    <ul className="space-y-2">{meal.items.map((item, i) => (<li key={i} className="text-sm text-slate-300 flex justify-between border-b border-slate-700/50 pb-1 last:border-0"><span>{item.name}</span><span className="text-emerald-400 font-bold">{item.displayPortion}</span></li>))}</ul>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'workout' && (
                         <div className="space-y-4">{result.workoutPlan.map((workout, idx) => (<div key={idx} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden"><div className="bg-slate-700/50 p-4 border-b border-slate-700"><h4 className="font-bold text-white flex items-center gap-2"><Dumbbell size={18} className="text-emerald-400"/> {workout.title}</h4></div><div className="divide-y divide-slate-700/50">{workout.exercises.map((ex, i) => (<div key={i} className="p-4 flex justify-between items-center"><span className="text-sm font-medium text-slate-300">{ex.name}</span><span className="text-xs font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">{ex.sets}</span></div>))}</div></div>))}</div>
                    )}
                </div>
            )}
        </div>

        {step > 1 && (
            <div className="p-6 bg-slate-900 border-t border-slate-800 flex gap-4 relative z-20">
                <button onClick={prevStep} aria-label="Voltar" className="p-4 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><ChevronLeft /></button>
                {step === 4 ? (
                    <div className="flex-1 flex gap-2">
                        <button onClick={handleSaveDiet} disabled={isSaving} className="bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl px-6 flex items-center gap-2 border border-slate-700">
                             {isSaving ? "Salvando..." : <><Save size={18}/> Salvar</>}
                        </button>
                        <button onClick={() => result && generatePDF(userData, result)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-4 flex justify-center gap-2 items-center">Baixar PDF <Check size={18}/></button>
                    </div>
                ) : (
                    <button onClick={nextStep} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-4 flex justify-center gap-2">{step === 3 ? 'Calcular Protocolo' : 'Continuar'} <ChevronRight /></button>
                )}
            </div>
        )}
      </div>
    </div>
  );
}

export default App;