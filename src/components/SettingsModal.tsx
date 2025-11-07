import React, { useState, useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  minExamWpm: number;
  onSave: (wpm: number) => void;
};

export default function SettingsModal({ open, onClose, minExamWpm, onSave }: Props) {
  const [wpm, setWpm] = useState<number>(minExamWpm);

  useEffect(() => { setWpm(minExamWpm); }, [minExamWpm, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 text-[#222222]">
        <h2 className="text-xl font-semibold mb-2">Thiết lập</h2>
        <p className="text-sm text-[#666666] mb-4">Đặt WPM tối thiểu để đậu mỗi bài kiểm tra cuối bài.</p>
        <label className="block text-xs uppercase tracking-wide text-[#666666] mb-1">WPM tối thiểu</label>
        <div className="flex items-center gap-2 mb-6">
          <input
            type="number"
            min={1}
            value={wpm}
            onChange={(e) => setWpm(Math.max(1, Number(e.target.value || 0)))}
            className="flex-1 bg-white border border-gray-300 rounded-md px-2 py-1 text-sm outline-none focus:border-[#007BFF]"
          />
          <span className="text-sm text-[#666666]">WPM</span>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100">Đóng</button>
          <button
            onClick={() => { onSave(wpm); onClose(); }}
            className="px-4 py-2 rounded-md bg-[#007BFF] text-white hover:opacity-90"
          >Lưu</button>
        </div>
      </div>
    </div>
  );
}
