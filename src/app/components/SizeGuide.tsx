import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Ruler, CheckCircle } from 'lucide-react';

const SIZES = [
  { indian: 1,  diameter: 12.0, us: '0'    },
  { indian: 2,  diameter: 12.4, us: '0.5'  },
  { indian: 3,  diameter: 12.9, us: '1'    },
  { indian: 4,  diameter: 13.3, us: '1.5'  },
  { indian: 5,  diameter: 13.7, us: '2'    },
  { indian: 6,  diameter: 14.1, us: '2.5'  },
  { indian: 7,  diameter: 14.5, us: '3'    },
  { indian: 8,  diameter: 14.9, us: '3.5'  },
  { indian: 9,  diameter: 15.3, us: '4'    },
  { indian: 10, diameter: 15.7, us: '4.5'  },
  { indian: 11, diameter: 16.1, us: '5'    },
  { indian: 12, diameter: 16.5, us: '5.5'  },
  { indian: 13, diameter: 16.9, us: '6'    },
  { indian: 14, diameter: 17.3, us: '6.5'  },
  { indian: 15, diameter: 17.7, us: '7'    },
  { indian: 16, diameter: 18.2, us: '7.5'  },
  { indian: 17, diameter: 18.6, us: '8'    },
  { indian: 18, diameter: 19.0, us: '8.5'  },
  { indian: 19, diameter: 19.4, us: '9'    },
  { indian: 20, diameter: 19.8, us: '9.5'  },
  { indian: 21, diameter: 20.2, us: '10'   },
  { indian: 22, diameter: 20.6, us: '10.5' },
  { indian: 23, diameter: 21.0, us: '11'   },
  { indian: 24, diameter: 21.4, us: '11.5' },
  { indian: 25, diameter: 21.8, us: '12'   },
];

const HOW_TO_STEPS = [
  { n: 1, text: 'Cut a thin strip of paper or use a piece of string.' },
  { n: 2, text: 'Wrap it snugly (not tightly) around the base of the finger you want to size.' },
  { n: 3, text: 'Mark where the paper/string overlaps and measure the length in millimetres.' },
  { n: 4, text: 'Divide by π (3.14159) to get the inner diameter in mm.' },
  { n: 5, text: 'Find your size in the chart below — or enter the diameter in the finder.' },
];

function suggestSize(diam: number) {
  const closest = SIZES.reduce((prev, curr) =>
    Math.abs(curr.diameter - diam) < Math.abs(prev.diameter - diam) ? curr : prev,
  );
  return closest;
}

export function SizeGuide() {
  const [input, setInput]         = useState('');
  const [suggestion, setSuggestion] = useState<typeof SIZES[0] | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const handleFind = () => {
    const d = parseFloat(input);
    if (!isNaN(d) && d > 0) setSuggestion(suggestSize(d));
  };

  return (
    <section id="size-guide" className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="flex justify-center mb-4">
            <Ruler size={36} className="text-gray-700" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-3">Ring Size Guide</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Find your perfect fit using our Indian size chart or the diameter calculator below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* How to measure */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h3 className="font-serif text-2xl mb-6">How to Measure</h3>
            <ol className="space-y-4">
              {HOW_TO_STEPS.map((step) => (
                <li key={step.n} className="flex gap-4 items-start">
                  <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {step.n}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.text}</p>
                </li>
              ))}
            </ol>

            {/* Diameter finder */}
            <div className="mt-8 p-6 bg-white border border-gray-200">
              <h4 className="font-serif text-lg mb-4">Size Finder</h4>
              <p className="text-gray-500 text-sm mb-4">Enter your inner diameter in millimetres:</p>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="10"
                  max="25"
                  step="0.1"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setSuggestion(null); }}
                  placeholder="e.g. 16.5"
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button
                  onClick={handleFind}
                  className="px-5 py-2 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors"
                >
                  Find
                </button>
              </div>

              {suggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200"
                >
                  <CheckCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Recommended: <strong>Indian Size {suggestion.indian}</strong>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Diameter {suggestion.diameter} mm · US Size {suggestion.us}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Size chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="overflow-x-auto"
          >
            <h3 className="font-serif text-2xl mb-6">Size Chart (Indian)</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 py-2.5 text-left text-xs tracking-widest font-normal">Indian</th>
                  <th className="px-4 py-2.5 text-left text-xs tracking-widest font-normal">Diameter (mm)</th>
                  <th className="px-4 py-2.5 text-left text-xs tracking-widest font-normal">US Size</th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((row, i) => (
                  <tr
                    key={row.indian}
                    className={`border-b border-gray-100 transition-colors ${
                      suggestion?.indian === row.indian
                        ? 'bg-amber-50 font-semibold'
                        : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'
                    }`}
                  >
                    <td className="px-4 py-2">{row.indian}</td>
                    <td className="px-4 py-2">{row.diameter}</td>
                    <td className="px-4 py-2">{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
