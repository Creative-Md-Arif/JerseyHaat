import React from 'react';

const SizeGuide = ({ onClose }) => {
  const sizeData = [
    { size: 'S', chest: '36-38', length: '27', sleeve: '8' },
    { size: 'M', chest: '38-40', length: '28', sleeve: '8.5' },
    { size: 'L', chest: '40-42', length: '29', sleeve: '9' },
    { size: 'XL', chest: '42-44', length: '30', sleeve: '9.5' },
    { size: 'XXL', chest: '44-46', length: '31', sleeve: '10' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-dark-2 border border-dark-3 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-3">
          <h2 className="font-serif text-2xl text-cream">Jersey Size Guide</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-3 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Size Chart */}
        <div className="p-6">
          <p className="text-text-muted text-sm mb-4">
            All measurements are in inches. For the best fit, measure a jersey you already own and compare.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gold/30">
                  <th className="py-3 px-4 text-gold font-medium">Size</th>
                  <th className="py-3 px-4 text-gold font-medium">Chest</th>
                  <th className="py-3 px-4 text-gold font-medium">Length</th>
                  <th className="py-3 px-4 text-gold font-medium">Sleeve</th>
                </tr>
              </thead>
              <tbody>
                {sizeData.map((row, index) => (
                  <tr
                    key={row.size}
                    className={`border-b border-dark-3 ${
                      index % 2 === 0 ? 'bg-dark/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-cream">{row.size}</td>
                    <td className="py-3 px-4 text-text-muted">{row.chest}&quot;</td>
                    <td className="py-3 px-4 text-text-muted">{row.length}&quot;</td>
                    <td className="py-3 px-4 text-text-muted">{row.sleeve}&quot;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure */}
          <div className="mt-6 p-4 bg-dark rounded-lg border border-dark-3">
            <h3 className="font-medium text-cream mb-3">How to Measure</h3>
            <div className="space-y-2 text-sm text-text-muted">
              <div className="flex items-start gap-3">
                <span className="text-gold font-medium mt-0.5">1.</span>
                <span><strong className="text-cream">Chest:</strong> Measure across the fullest part of the chest, from armpit to armpit.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold font-medium mt-0.5">2.</span>
                <span><strong className="text-cream">Length:</strong> Measure from the highest point of the shoulder to the bottom hem.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold font-medium mt-0.5">3.</span>
                <span><strong className="text-cream">Sleeve:</strong> Measure from the shoulder seam to the end of the sleeve.</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-4 text-sm text-text-muted">
            <p>
              <span className="text-gold">Tip:</span> If you prefer a looser fit, consider ordering one size up.
              Authentic jerseys tend to have an athletic fit.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-3">
          <button onClick={onClose} className="btn-secondary w-full text-center">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
