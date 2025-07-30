import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { formatGroupList } from '../utils/pairing';
import type { Pairing } from '../types';

interface GroupDisplayProps {
  pairing: Pairing;
}

export function GroupDisplay({ pairing }: GroupDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const formattedText = formatGroupList(pairing.pairs);
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const formattedDate = new Date(pairing.date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">آخر فرق مُنشأة</h2>
        <span className="text-sm text-gray-600">{formattedDate}</span>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <pre className="whitespace-pre-wrap font-medium text-gray-800 leading-relaxed">
          {formatGroupList(pairing.pairs)}
        </pre>
      </div>
      
      <button
        onClick={handleCopy}
        className={`flex items-center space-x-reverse space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
          copied 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>تم النسخ!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>نسخ القائمة</span>
          </>
        )}
      </button>
    </div>
  );
}