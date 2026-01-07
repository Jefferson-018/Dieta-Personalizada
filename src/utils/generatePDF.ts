// src/utils/generatePDF.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DietResult, UserData } from '../types';

export const generatePDF = (userData: UserData, result: DietResult) => {
  const doc = new jsPDF();
  const margin = 15;
  
  // --- CABEÇALHO (VERDE ESMERALDA) ---
  doc.setFillColor(16, 185, 129); // Emerald-500
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("DIETA PERSONALIZADA", margin, 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Protocolo Nutricional & Treino", margin, 28);

  const date = new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(10);
  doc.text(`Gerado em: ${date}`, 195, 20, { align: 'right' });

  // --- DADOS DO CLIENTE ---
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PERFIL DO ALUNO", margin, 50);

  autoTable(doc, {
    startY: 55,
    head: [['Nome', 'Idade', 'Peso', 'Altura', 'Objetivo']],
    body: [[
      userData.name || 'Não informado',
      `${userData.age} anos`,
      `${userData.weight}kg`,
      `${userData.height}cm`,
      userData.goal === 'loss' ? 'Secar (Perda de Gordura)' : userData.goal === 'mass' ? 'Hipertrofia (Ganho)' : 'Manutenção'
    ]],
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [240, 240, 240], textColor: 80 }
  });

  // --- RESUMO DA META ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129); // Verde
  doc.text(`META DIÁRIA: ${result.calories} KCAL`, margin, finalY);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Proteína: ${result.macros.p}g  |  Carbo: ${result.macros.c}g  |  Gordura: ${result.macros.f}g`, margin, finalY + 6);
  
  // Dica de Água
  const water = (Number(userData.weight) * 35 / 1000).toFixed(1);
  doc.text(`Meta de Água: ${water} Litros por dia`, margin, finalY + 11);

  // --- TABELA DA DIETA ---
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  doc.text("PLANO ALIMENTAR", margin, finalY + 25);

  const dietRows = result.meals.map(meal => {
    const foods = meal.items.map(item => `• ${item.name} (${item.displayPortion})`).join('\n');
    return [meal.time, meal.name, foods, `~${meal.calories} kcal`];
  });

  autoTable(doc, {
    startY: finalY + 30,
    head: [['Horário', 'Refeição', 'Itens / Quantidade', 'Calorias']],
    body: dietRows,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' }, // Header Verde
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 30 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 25 }
    },
    styles: { fontSize: 9, valign: 'middle' }
  });

  // --- TREINO ---
  let workoutY = (doc as any).lastAutoTable.finalY + 20;
  
  if (workoutY > 250) {
    doc.addPage();
    workoutY = 20;
  }

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  doc.text("PROTOCOLO DE TREINO", margin, workoutY);

  result.workoutPlan.forEach((workout) => {
    workoutY += 10;
    if (workoutY > 270) { doc.addPage(); workoutY = 20; }
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129); // Verde
    doc.text(workout.title, margin, workoutY);

    const exerciseRows = workout.exercises.map(ex => [ex.name, ex.sets]);
    
    autoTable(doc, {
      startY: workoutY + 2,
      head: [['Exercício', 'Séries / Repetições']],
      body: exerciseRows,
      theme: 'striped',
      headStyles: { fillColor: [80, 80, 80], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { left: margin }
    });

    workoutY = (doc as any).lastAutoTable.finalY + 5;
  });

  // --- RODAPÉ ---
  const pageCount = doc.internal.pages.length - 1;
  for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Este documento é uma sugestão gerada automaticamente. Consulte um nutricionista.', margin, 285);
      doc.text(`Página ${i} de ${pageCount}`, 195, 285, { align: 'right' });
  }

  doc.save(`Dieta_${userData.name || 'Personalizada'}.pdf`);
};