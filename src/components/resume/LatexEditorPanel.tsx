import React from 'react';
import Editor from '@monaco-editor/react';
import { Undo2, Redo2, Bold, Italic, Type, List, Table, Image as ImageIcon, FileCode } from 'lucide-react';
import type { Resume } from '../../domain/resume';

interface LatexEditorPanelProps {
  activeResume: Resume;
  setActiveResume: React.Dispatch<React.SetStateAction<Resume | null>>;
}

export const LatexEditorPanel: React.FC<LatexEditorPanelProps> = ({ activeResume, setActiveResume }) => {
  return (
    <div className="latex-studio-container">
       <div className="latex-top-tools">
          <div className="tool-row">
             <div className="tool-btn-grp">
                <button><Undo2 size={14} /></button>
                <button><Redo2 size={14} /></button>
             </div>
             <div className="divider-v"></div>
             <div className="tool-btn-grp">
                <button><Bold size={14} /></button>
                <button><Italic size={14} /></button>
                <button><Type size={14} /></button>
             </div>
             <div className="divider-v"></div>
             <div className="tool-btn-grp">
                <button><List size={14} /></button>
                <button><Table size={14} /></button>
                <button><ImageIcon size={14} /></button>
             </div>
          </div>
          <div className="file-header">
             <FileCode size={14} /> <span>main.tex</span>
             <div className="status-tag">Editing</div>
          </div>
       </div>
       <div className="code-editor-wrap">
          <Editor
             height="100%"
             defaultLanguage="latex"
             theme="vs"
             value={activeResume.latex_code || ''}
             onChange={(val) => setActiveResume({ ...activeResume, latex_code: val || '' })}
             options={{ 
                minimap: { enabled: false }, 
                fontSize: 14, 
                lineHeight: 1.6,
                padding: { top: 20 },
                scrollbar: { vertical: 'hidden' },
                fontFamily: "'Fira Code', monospace"
             }}
          />
       </div>
    </div>
  );
};
