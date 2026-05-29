'use client';

import React, { useRef } from 'react';

export default function RichTextEditor({ value, onChange }: { value?: string; onChange?: (html: string) => void }) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    onChange?.(editorRef.current?.innerHTML || '');
  };

  const handleImageUpload = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/uploads', { method: 'POST', body: fd });
    const data = await res.json();
    if (data?.url) {
      exec('insertImage', data.url);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, isVideo = false) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (isVideo) {
      // upload and insert iframe wrapper
      (async () => {
        const fd = new FormData();
        fd.append('file', f);
        const res = await fetch('/api/uploads', { method: 'POST', body: fd });
        const data = await res.json();
        if (data?.url) {
          const html = `<iframe src="${data.url}" frameborder="0" class="w-full h-64" allowfullscreen></iframe>`;
          document.execCommand('insertHTML', false, html);
          onChange?.(editorRef.current?.innerHTML || '');
        }
      })();
    } else {
      handleImageUpload(f);
    }
    e.currentTarget.value = '';
  };

  return (
    <div>
      <div className="mb-2 flex gap-2 flex-wrap">
        <button type="button" onClick={() => exec('bold')} className="btn">B</button>
        <button type="button" onClick={() => exec('italic')} className="btn">I</button>
        <button type="button" onClick={() => exec('formatBlock', '<H1>')} className="btn">H1</button>
        <button type="button" onClick={() => exec('formatBlock', '<H2>')} className="btn">H2</button>
        <button type="button" onClick={() => exec('insertUnorderedList')} className="btn">• List</button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="btn">1. List</button>
        <label className="btn cursor-pointer">
          Insert Image
          <input type="file" accept="image/*" onChange={(e) => handleFileInput(e, false)} className="hidden" />
        </label>
        <label className="btn cursor-pointer">
          Insert Video
          <input type="file" accept="video/*" onChange={(e) => handleFileInput(e, true)} className="hidden" />
        </label>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[200px] border border-gray-200 rounded p-4 bg-white"
        onInput={() => onChange?.(editorRef.current?.innerHTML || '')}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    </div>
  );
}
