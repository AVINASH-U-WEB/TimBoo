import React, { useState } from 'react';
// Using Zap for the "process" button, and Beaker for the header icon.
import { Zap, Beaker } from 'lucide-react';

interface ConversationalInputProps {
  onSubmit: (input: string) => void;
  isProcessing: boolean;
}

const ConversationalInput: React.FC<ConversationalInputProps> = ({ onSubmit, isProcessing }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  const examplePrompts = [
    "Okay, DayMixer! Blended in a 45-min run, 3 hours of deep work, a loooong meeting, and then got lost in a YouTube rabbit hole for way too long 😅",
    "Here's the recipe: a dash of reading (1hr), a big scoop of coding my side project (4hrs), a splash of coffee with my neighbor, and a whole lot of meal prep! 🥑",
    "Today's mix was... chunky. Tried to work on a presentation but my brain was static. Tossed in a walk and cooked a killer dinner to save the day! 🍲"
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-4xl mx-auto border-2 border-slate-100 transform -rotate-1">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-rose-400 rounded-2xl flex items-center justify-center flex-shrink-0 transform -rotate-12 shadow-lg">
          <Beaker className="w-8 h-8 text-white" />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tighter">Ready to Blend Your Day?</h2>
          <p className="text-slate-600">Toss your day's ingredients in here—the good, the bad, and the lazy. I'll whip it up into something amazing! ✨</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's the recipe for your day? e.g., 'Woke up late, rushed through a 2-hour project, had a 30-min lunch, then chilled with a movie...'"
            className="w-full p-4 pl-5 pr-20 border-2 border-slate-200 bg-slate-50 rounded-2xl focus:border-amber-400 focus:ring-2 focus:ring-amber-300 focus:outline-none resize-none transition-all duration-200"
            rows={5}
            disabled={isProcessing}
          />
          <div className="absolute bottom-3 right-3">
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="bg-gradient-to-r from-amber-500 to-rose-500 text-white p-3 rounded-full hover:scale-110 hover:-rotate-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:rotate-0 transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Submit Day"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8">
        <p className="text-sm text-slate-500 mb-3 font-medium text-center">
          Need a recipe idea? Try one of these starters!
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => !isProcessing && setInput(prompt)}
              disabled={isProcessing}
              className="text-left text-sm text-slate-700 hover:text-rose-700 bg-amber-50 hover:bg-amber-100 p-3 rounded-xl transition-all duration-200 border border-amber-100 hover:border-amber-200 hover:scale-105 hover:-rotate-2 disabled:opacity-70 disabled:transform-none"
            >
              "{prompt.substring(0, 80)}..."
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationalInput;