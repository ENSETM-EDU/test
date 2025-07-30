import React, { useState, useEffect } from 'react';
import { History, RefreshCw, Copy, Check } from 'lucide-react';
import { pairingService } from '../services/pairings';
import { formatGroupList } from '../utils/pairing';
import type { Pairing } from '../types';

export function HistoryPage() {
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadPairings();
  }, []);

  const loadPairings = async () => {
    try {
      const data = await pairingService.getAll();
      setPairings(data);
    } catch (error) {
      console.error('Error loading pairings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (pairing: Pairing) => {
    try {
      const formattedText = formatGroupList(pairing.pairs);
      await navigator.clipboard.writeText(formattedText);
      setCopiedId(pairing.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-reverse space-x-3">
          <History className="w-8 h-8" />
          <span>سجل الفرق</span>
        </h1>
        <div className="text-sm text-gray-600">
          إجمالي الفرق: {pairings.length}
        </div>
      </div>

      {pairings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">لا يوجد سجل للفرق بعد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pairings.map((pairing) => (
            <div key={pairing.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold text-gray-800">
                  {new Date(pairing.date).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </div>
                <button
                  onClick={() => handleCopy(pairing)}
                  className={`flex items-center space-x-reverse space-x-2 px-3 py-1 rounded-md text-sm transition-all ${
                    copiedId === pairing.id
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {copiedId === pairing.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {pairing.pairs.map(([name1, name2], index) => (
                    <div
                      key={index}
                      className="text-center p-2 bg-white rounded border border-gray-200"
                    >
                      {name1} - {name2}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}