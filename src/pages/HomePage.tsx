import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { GroupDisplay } from '../components/GroupDisplay';
import { useAuth } from '../hooks/useAuth';
import { pairingService } from '../services/pairings';
import { memberService } from '../services/members';
import { generatePairs, areAllCombinationsUsed } from '../utils/pairing';
import type { Pairing, Member } from '../types';

export function HomePage() {
  const { isAdmin } = useAuth();
  const [latestPairing, setLatestPairing] = useState<Pairing | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadLatestPairing();
  }, []);

  const loadLatestPairing = async () => {
    try {
      const pairing = await pairingService.getLatest();
      setLatestPairing(pairing);
    } catch (error) {
      console.error('Error loading latest pairing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNew = async () => {
    setGenerating(true);
    try {
      const members = await memberService.getAll();
      
      if (members.length < 2) {
        alert('يجب أن يكون هناك عضوان على الأقل لإنشاء الفرق');
        return;
      }

      const memberNames = members.map(m => m.name);
      const usedPairs = await pairingService.getAllPairs();
      
      if (areAllCombinationsUsed(memberNames, usedPairs)) {
        const shouldReset = confirm('تم استخدام جميع التركيبات الممكنة. هل تريد إعادة تعيين التاريخ والبدء من جديد؟');
        if (!shouldReset) return;
      }

      const pairs = generatePairs(memberNames);
      
      // Additional safety check
      const hasSelfPair = pairs.some(([name1, name2]) => name1 === name2);
      if (hasSelfPair) {
        alert('حدث خطأ في إنشاء الفرق. يرجى المحاولة مرة أخرى.');
        return;
      }
      
      const newPairing = await pairingService.create(pairs);
      setLatestPairing(newPairing);
    } catch (error) {
      console.error('Error generating new pairing:', error);
      alert('حدث خطأ أثناء إنشاء الفرق');
    } finally {
      setGenerating(false);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">الصفحة الرئيسية</h1>
        {isAdmin && (
          <button
            onClick={handleGenerateNew}
            disabled={generating}
            className="flex items-center space-x-reverse space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            <span>إنشاء مجموعة جديدة</span>
          </button>
        )}
      </div>

      {latestPairing ? (
        <GroupDisplay pairing={latestPairing} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">لم يتم إنشاء أي فرق بعد</p>
          {isAdmin && (
            <button
              onClick={handleGenerateNew}
              disabled={generating}
              className="flex items-center space-x-reverse space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>إنشاء أول مجموعة</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}