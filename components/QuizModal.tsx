import React from 'react';
import { QuizQuestion } from '../types';

interface QuizModalProps {
  show: boolean;
  showResult: boolean;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: number[];
  language: 'zh' | 'en';
  onClose: () => void;
  onAnswer: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onResultClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({
  show,
  showResult,
  questions,
  currentIndex,
  answers,
  language,
  onClose,
  onAnswer,
  onPrevious,
  onNext,
  onSubmit,
  onResultClose
}) => {
  if (!show) return null;

  if (showResult) {
    const accuracy = Math.round((answers.filter((a, i) => a === questions[i].correctAnswer).length / questions.length) * 100);
    let comment = { zh: '', en: '' };
    let colorClass = '';
    
    if (accuracy === 100) {
      comment = { 
        zh: '🎉 完美无缺！你完全掌握了户外生存的核心知识。山神会眷顾有准备的人。', 
        en: '🎉 PERFECT! You have mastered outdoor survival knowledge. The Mountain God favors the prepared.' 
      };
      colorClass = 'text-emerald-400';
    } else if (accuracy >= 90) {
      comment = { 
        zh: '🏔️ 优秀！你的知识储备已经达到了经验丰富的登山者水平。', 
        en: '🏔️ EXCELLENT! Your knowledge rivals experienced mountaineers.' 
      };
      colorClass = 'text-green-400';
    } else if (accuracy >= 80) {
      comment = { 
        zh: '✅ 良好！你已具备基本的户外生存能力，但仍需加深理解。', 
        en: '✅ GOOD! You have basic survival skills but need deeper understanding.' 
      };
      colorClass = 'text-sky-400';
    } else if (accuracy >= 60) {
      comment = { 
        zh: '⚠️ 及格！你掌握了一些知识，但进山前还需更多准备和学习。', 
        en: '⚠️ PASS! You know some basics but need more preparation before entering mountains.' 
      };
      colorClass = 'text-yellow-400';
    } else if (accuracy >= 40) {
      comment = { 
        zh: '❌ 危险！你的知识储备不足以应对野外险境。请认真学习后再考虑户外活动。', 
        en: '❌ DANGEROUS! Your knowledge is insufficient for wilderness. Study before attempting outdoor activities.' 
      };
      colorClass = 'text-orange-400';
    } else {
      comment = { 
        zh: '🚫 致命！以你目前的知识水平进山，几乎等于自杀。秦岭圣山绝不留情于无知者。', 
        en: '🚫 FATAL! Entering mountains with your current knowledge is nearly suicidal. The Sacred Mountain shows no mercy to the ignorant.' 
      };
      colorClass = 'text-red-500';
    }

    return (
      <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 hardware-accel animate-in fade-in duration-300">
        <div className="max-w-2xl w-full cyber-panel p-8 rounded-[2rem] border border-amber-500/30 flex flex-col max-h-[85vh]">
          <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-6 text-center">
            {language === 'zh' ? '答题结果' : 'Quiz Results'}
          </h2>
          
          <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 mb-6">
            {questions.map((q, idx) => {
              const isCorrect = answers[idx] === q.correctAnswer;
              return (
                <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-950/30 border-green-500/40' : 'bg-red-950/30 border-red-500/40'}`}>
                  <p className="text-xs font-bold mb-2">
                    {idx + 1}. {q.question[language]}
                  </p>
                  <p className={`text-xs mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {language === 'zh' ? '你的答案：' : 'Your answer: '} {q.options[answers[idx]][language]}
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-amber-300 mb-2">
                      {language === 'zh' ? '正确答案：' : 'Correct answer: '} {q.options[q.correctAnswer][language]}
                    </p>
                  )}
                  <p className="text-xs text-slate-300 italic">{q.explanation[language]}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mb-4 space-y-3">
            <p className="text-lg font-black text-white">
              {language === 'zh' ? '答题正确率：' : 'Accuracy: '}
              <span className="text-amber-400">{accuracy}%</span>
            </p>
            <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
              <p className={`text-sm font-bold ${colorClass} leading-relaxed`}>
                {comment[language]}
              </p>
            </div>
          </div>

          <button
            onClick={onResultClose}
            className="w-full py-3 bg-white text-black rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"
          >
            {language === 'zh' ? '关闭' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 hardware-accel animate-in fade-in duration-300">
      <div className="max-w-2xl w-full cyber-panel p-8 rounded-[2rem] border border-amber-500/30 flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black italic text-amber-400 uppercase tracking-tighter">
            ❓ {language === 'zh' ? '户外知识问答' : 'Outdoor Knowledge Quiz'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
        </div>
        <p className="text-xs text-slate-400 mb-4">{`${currentIndex + 1}/${questions.length}`}</p>
        
        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 mb-4">
          <h3 className="text-sm font-bold text-white">{questions[currentIndex].question[language]}</h3>
          <div className="space-y-2">
            {questions[currentIndex].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => onAnswer(idx)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                  answers[currentIndex] === idx
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-slate-900/50 border-white/10 text-slate-300 hover:border-amber-500/30'
                }`}
              >
                <span className="font-bold">{String.fromCharCode(65 + idx)}.</span> {opt[language]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold disabled:opacity-50"
          >
            {language === 'zh' ? '上一题' : 'Previous'}
          </button>
          {currentIndex === questions.length - 1 ? (
            <button
              onClick={onSubmit}
              className="flex-1 py-2 bg-amber-500 text-black rounded-lg text-xs font-bold hover:bg-amber-600 transition-all"
            >
              {language === 'zh' ? '提交答案' : 'Submit'}
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex-1 py-2 bg-amber-500 text-black rounded-lg text-xs font-bold hover:bg-amber-600 transition-all"
            >
              {language === 'zh' ? '下一题' : 'Next'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
