// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase'; 
import { collection, getDocs, orderBy, query } from 'firebase/firestore'; 
import { generatePDF } from '../utils/generatePDF'; 
import { Plus, Search, FileText, User, Calendar, LogOut, Loader2 } from 'lucide-react';
import { DietResult, UserData } from '../types';

interface DashboardProps {
  onNewDiet: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNewDiet, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [diets, setDiets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const dietCollection = collection(db, "diets");
        const q = query(dietCollection, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const dietList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDiets(dietList);
      } catch (error) {
        console.error("Erro ao buscar dietas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiets();
  }, []);

  const filteredDiets = diets.filter(d => 
    d.userData.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans text-slate-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header do Painel */}
        <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
            <div>
                <h1 className="text-2xl font-bold text-white">Painel do Especialista</h1>
                <p className="text-slate-400 text-sm">Gerencie seus pacientes e protocolos.</p>
            </div>
            <div className="flex gap-3">
                {/* CORREÇÃO AQUI: Adicionado aria-label="Sair" */}
                <button onClick={onLogout} aria-label="Sair" className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 transition-colors border border-slate-700">
                    <LogOut size={20} />
                </button>
                <button onClick={onNewDiet} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                    <Plus size={20} /> Novo Paciente
                </button>
            </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
                type="text" 
                placeholder="Buscar paciente por nome..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
        </div>

        {/* Lista de Pacientes */}
        {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
        ) : filteredDiets.length === 0 ? (
            <div className="text-center py-20 opacity-50 border-2 border-dashed border-slate-800 rounded-3xl">
                <User size={48} className="mx-auto mb-4 text-slate-600" />
                <p>Nenhum paciente cadastrado ainda.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDiets.map((diet) => (
                    <div key={diet.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             {/* CORREÇÃO AQUI: Adicionado aria-label="Baixar PDF" */}
                             <button 
                                onClick={() => generatePDF(diet.userData as UserData, diet.result as DietResult)}
                                aria-label="Baixar PDF"
                                className="bg-emerald-600 text-white p-2 rounded-lg shadow-lg hover:scale-110 transition-transform" 
                                title="Baixar PDF Novamente"
                             >
                                <FileText size={18} />
                             </button>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-500 font-bold border border-slate-700">
                                {diet.userData.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-white truncate w-40">{diet.userData.name}</h3>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{diet.userData.goal === 'loss' ? 'Secar' : diet.userData.goal === 'mass' ? 'Hipertrofia' : 'Manter'}</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-400 mb-4">
                            <div className="flex justify-between items-center bg-slate-950/50 p-2 rounded-lg">
                                <span className="flex items-center gap-2"><Calendar size={14}/> Data</span>
                                <span className="text-white">{diet.createdAt ? new Date(diet.createdAt.seconds * 1000).toLocaleDateString() : 'Hoje'}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-950/50 p-2 rounded-lg">
                                <span>Calorias</span>
                                <span className="text-emerald-400 font-bold">{diet.result.calories} kcal</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};