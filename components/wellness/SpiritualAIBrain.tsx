'use client';

import React, { useState, useEffect } from 'react';
// Cambiamos Target por Wind para representar la respiración de la meditación
import { Sparkles, Heart, BookOpen, Wind, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Tu llave funcionando
const apiKey = "AIzaSyAtgbZnaaiwWE_DoNp6r_ulijOwM1WI8HE"; 
const genAI = new GoogleGenerativeAI(apiKey);

// Actualizamos el tipo para incluir meditacion
type TabType = 'oracion' | 'biblia' | 'meditacion';

export default function SpiritualAIBrain() {
  const [activeTab, setActiveTab] = useState<TabType>('oracion');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    loadLastContent();
  }, [activeTab]);

  const loadLastContent = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_history')
        .select('content')
        .eq('type', activeTab)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setContent(data[0].content);
      } else {
        setContent(getDefaultPlaceholder(activeTab));
      }
    } catch (e) {
      console.error("Error al cargar historial:", e);
      setContent(getDefaultPlaceholder(activeTab));
    }
  };

  const getDefaultPlaceholder = (tab: TabType) => {
    const placeholders = {
      oracion: "Presiona el botón para generar tu oración diaria de gratitud, petición y alabanza.",
      biblia: "Haz clic para sumergirte en un estudio bíblico profundo de 30 minutos con raíces judías.",
      meditacion: "Inicia tu sesión de respiración y declaraciones de fe mediante la gratitud."
    };
    return placeholders[tab];
  };

  const generateWithIA = async () => {
    setLoading(true);
    
    // Prompts milimétricamente ajustados a tus instrucciones
    const prompts = {
      oracion: "Escribe una oración con un profundo enfoque judío. La oración debe tener exactamente tres partes conectadas entre sí: 1. Dar gracias a Dios por todo, 2. Hacer una petición, 3. Alabar a Dios. Toda la oración debe tener una longitud de entre 5 y 8 líneas en total. Es absolutamente OBLIGATORIO que las últimas palabras de la oración sean exactamente estas: 'en el nombre de tu hijo amado Jesucristo Amén y amén.'",
      
      biblia: "Desarrolla un estudio bíblico serio y profundo con perspectiva y contexto histórico judío (raíces hebreas). El estudio debe contener material suficiente para unos 30 minutos de lectura y asimilación. Debe incluir: versículos principales, contexto histórico/cultural de la época, reflexiones profundas y explicaciones detalladas. Usa un tono sabio, de estudio teológico serio.",
      
      meditacion: "Crea una guía de meditación progresiva basada en la respiración consciente. No hables de mindfulness secular, enfócalo en la fe. Guía al usuario en ejercicios de respiración y proporciona frases de declaración y agradecimiento para repetir. El enfoque central de estas frases debe ser dar gracias por cosas que el usuario desea como si YA las tuviera, bajo la convicción absoluta de que la bendición ya llegó a su vida."
    };

    try {
      // Usando el modelo de última generación que te autorizó Google
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompts[activeTab]);
      const text = result.response.text();
      
      if (text) {
        setContent(text);
        await supabase.from('ai_history').insert({ type: activeTab, content: text });
      } else {
        throw new Error("Respuesta vacía de la IA");
      }
    } catch (error) {
      console.error("Error al generar contenido:", error);
      setContent("Hubo un problema al conectar con la IA. Por favor, intenta de nuevo en unos segundos.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border shadow-xl overflow-hidden h-full flex flex-col">
      <div className="flex border-b border-border bg-background/50">
        {(['oracion', 'biblia', 'meditacion'] as TabType[]).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-[10px] md:text-xs font-black transition-all uppercase tracking-widest",
              activeTab === tab ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            {tab === 'oracion' && <Heart className="w-4 h-4" />}
            {tab === 'biblia' && <BookOpen className="w-4 h-4" />}
            {/* Nuevo icono para la meditación guiada por respiración */}
            {tab === 'meditacion' && <Wind className="w-4 h-4" />}
            <span className="hidden sm:inline ml-1">{tab}</span>
          </button>
        ))}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="relative flex-1 min-h-[200px] mb-6 rounded-xl bg-background/40 p-5 border border-border/50 group flex flex-col shadow-inner">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-[10px] font-black animate-pulse uppercase tracking-[0.2em] text-muted-foreground">Sincronizando con la IA...</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto custom-scrollbar">
                <p className="whitespace-pre-wrap leading-relaxed italic text-foreground/90 font-medium text-sm md:text-base">
                  {content}
                </p>
              </div>
              <button 
                onClick={copyToClipboard}
                title="Copiar texto"
                className="absolute top-2 right-2 p-2 rounded-lg bg-muted/80 hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100 border border-border"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>

        <button 
          onClick={generateWithIA}
          disabled={loading}
          className="w-full group relative flex items-center justify-center gap-3 py-4 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-lg hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 overflow-hidden"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:animate-pulse" /> Generar con IA
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}