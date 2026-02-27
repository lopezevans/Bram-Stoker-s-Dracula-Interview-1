import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen, BrainCircuit, Shuffle } from 'lucide-react';
import { flashcards, Flashcard } from './data';

export default function App() {
  const [deck, setDeck] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentCard = deck[currentIndex];

  const handleNext = useCallback(() => {
    setDirection(1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  }, [deck.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  }, [deck.length]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setDeck(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#0a0502] overflow-hidden relative">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #3a1510 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #ff4e00 0%, transparent 70%)' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-serif font-light tracking-widest uppercase mb-2 text-[#fff]"
        >
          Dracula
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base font-mono tracking-[0.2em] uppercase text-[#e0d8d0]"
        >
          The First Seventy Pages
        </motion.p>
      </header>

      {/* Main Flashcard Area */}
      <main className="relative z-10 w-full max-w-2xl aspect-[4/3] md:aspect-[3/2] perspective-1000">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ x: direction * 300, opacity: 0, rotateY: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="w-full h-full cursor-pointer"
            onClick={handleFlip}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
              className="relative w-full h-full preserve-3d"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-[#151619] border border-[#ffffff10] rounded-2xl p-8 md:p-12 flex flex-col shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#8e9299]">
                    {currentCard.category === 'Core Comprehension' ? <BookOpen size={12} /> : <BrainCircuit size={12} />}
                    {currentCard.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#8e9299]">
                    {currentIndex + 1} / {deck.length}
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center text-center">
                  <h2 className="text-xl md:text-3xl font-serif leading-relaxed italic text-[#fff]">
                    {currentCard.question}
                  </h2>
                </div>
                <div className="mt-8 text-center">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8e9299] opacity-50">
                    Click to reveal answer
                  </span>
                </div>
              </div>

              {/* Back Side */}
              <div 
                className="absolute inset-0 w-full h-full backface-hidden bg-[#1a1b1e] border border-[#ff4e0020] rounded-2xl p-8 md:p-12 flex flex-col shadow-2xl rotate-y-180"
                style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff4e00]">
                    Answer
                  </span>
                  <span className="text-[10px] font-mono text-[#8e9299]">
                    {currentIndex + 1} / {deck.length}
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center text-center overflow-y-auto">
                  <p className="text-lg md:text-2xl font-serif leading-relaxed text-[#e0d8d0]">
                    {currentCard.answer}
                  </p>
                </div>
                <div className="mt-8 text-center">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8e9299] opacity-50">
                    Click to see question
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Controls */}
      <nav className="relative z-10 mt-12 flex items-center gap-8">
        <button
          onClick={handlePrev}
          className="p-4 rounded-full border border-[#ffffff10] bg-[#151619] text-[#e0d8d0] hover:bg-[#ff4e00] hover:text-white transition-all duration-300 group"
          aria-label="Previous card"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#ffffff10] bg-[#151619] text-[10px] font-mono uppercase tracking-widest text-[#e0d8d0] hover:border-[#ff4e00] transition-all duration-300"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        <button
          onClick={handleShuffle}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#ffffff10] bg-[#151619] text-[10px] font-mono uppercase tracking-widest text-[#e0d8d0] hover:border-[#ff4e00] transition-all duration-300"
        >
          <Shuffle size={14} />
          Shuffle
        </button>

        <button
          onClick={handleNext}
          className="p-4 rounded-full border border-[#ffffff10] bg-[#151619] text-[#e0d8d0] hover:bg-[#ff4e00] hover:text-white transition-all duration-300 group"
          aria-label="Next card"
        >
          <ChevronRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Progress Bar */}
      <div className="relative z-10 mt-12 w-full max-w-md h-[1px] bg-[#ffffff10]">
        <motion.div 
          className="h-full bg-[#ff4e00]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Footer Meta */}
      <footer className="relative z-10 mt-12 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8e9299] opacity-40">
        Transylvania &bull; Whitby &bull; London
      </footer>
    </div>
  );
}
