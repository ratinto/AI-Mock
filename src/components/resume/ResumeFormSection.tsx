import React, { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import type { ResumeStructuredData as _ResumeStructuredData } from '../../domain/resume';

export const Field: React.FC<{ label: string, value: string, onChange: (v: string) => void, textarea?: boolean }> = ({ label, value, onChange, textarea }) => (
  <div className="field-studio">
    <label>{label}</label>
    {textarea ? (
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} />
    ) : (
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} />
    )}
  </div>
);

const ListView: React.FC<{ items: any[], onUpdate: any, sectionId: string }> = ({ items, onUpdate, sectionId }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const getTemplate = () => {
    if (sectionId === 'experience') return {company:'', role:'', start_date:'', end_date:'', description:'', incubated: '', hidden: false};
    if (sectionId === 'education') return {institution:'', degree:'', end_date:'', grade: '', hidden: false};
    if (sectionId === 'projects') return {name:'', description:'', technologies:[], github:'', demo:'', date:'', hidden: false};
    if (sectionId === 'skills') return {category:'', items:[], hidden: false};
    return {name:'', hidden: false};
  };
  const getSummary = (item: any) => {
    if (sectionId === 'experience') return { title: item?.role || 'Role', subtitle: item?.company || 'Organization' };
    if (sectionId === 'education') return { title: item?.degree || 'Degree', subtitle: item?.institution || 'Institution' };
    if (sectionId === 'projects') return { title: item?.name || 'Project Name', subtitle: item?.date || 'Date' };
    if (sectionId === 'skills') return { title: item?.category || 'Category', subtitle: (item?.items || [])?.join?.(', ')?.substring(0, 30) };
    return { title: 'Entry', subtitle: 'Detail' };
  };
  if (editingIndex !== null) {
     const item = (items && items[editingIndex]) || getTemplate();
     const update = (newItem: any) => onUpdate((items || []).map((it, idx) => idx === editingIndex ? newItem : it));
     return (
        <div className="animate-fade">
           <button className="btn-secondary-studio" onClick={() => setEditingIndex(null)} style={{ marginBottom: '24px' }}>
              <ChevronLeft size={12} /> Back
           </button>
           {sectionId === 'experience' && (
              <>
                 <Field label="Job Title" value={item.role} onChange={v => update({...item, role: v})} />
                 <Field label="Organization" value={item.company} onChange={v => update({...item, company: v})} />
                 <Field label="Points" textarea value={item.description} onChange={v => update({...item, description: v})} />
              </>
           )}
           {sectionId === 'projects' && (
              <>
                 <Field label="Title" value={item.name} onChange={v => update({...item, name: v})} />
                 <Field label="Tech Stack" value={item.technologies?.join(', ')} onChange={v => update({...item, technologies: v.split(',').map(s=>s.trim())})} />
                 <Field label="Points" textarea value={item.description} onChange={v => update({...item, description: v})} />
              </>
           )}
           {sectionId === 'skills' && (
              <>
                 <Field label="Category" value={item.category} onChange={v => update({...item, category: v})} />
                 <Field label="Items" textarea value={item.items?.join(', ')} onChange={v => update({...item, items: v.split(',').map(s=>s.trim())})} />
              </>
           )}
           <button className="btn-primary-studio" onClick={() => setEditingIndex(null)} style={{ width: '100%', marginTop: '20px' }}>Save Entry</button>
        </div>
     );
  }
  return (
    <div className="item-list-view animate-fade">
       <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button className="btn-secondary-studio" onClick={() => {
             const newList = [...(items || []), getTemplate()];
             onUpdate(newList);
             setEditingIndex(newList.length - 1);
          }}>
             <Plus size={14} /> Add Item
          </button>
       </div>
       {(items || []).map((item, i) => {
          const summary = getSummary(item);
          return (
             <div key={i} className="item-summary-card">
                <div><h5>{summary.title}</h5><p>{summary.subtitle}</p></div>
                <button className="btn-secondary-studio" onClick={() => setEditingIndex(i)}>Edit</button>
             </div>
          );
       })}
    </div>
  );
};

export const SectionEditor: React.FC<{ sectionId: string, data: any, updateSection: any }> = ({ sectionId, data, updateSection }) => {
  if (!data) return null;
  const current = data[sectionId];
  switch (sectionId) {
    case 'general':
      return (
        <div className="animate-fade">
           <Field label="Full Name" value={current?.name || ''} onChange={v => updateSection('general', {...current, name: v})} />
           <Field label="Email" value={current?.email || ''} onChange={v => updateSection('general', {...current, email: v})} />
           <Field label="Phone" value={current?.phone || ''} onChange={v => updateSection('general', {...current, phone: v})} />
           <Field label="Summary" textarea value={current?.summary || ''} onChange={v => updateSection('general', {...current, summary: v})} />
        </div>
      );
    case 'socialLinks':
      return (
        <div className="animate-fade">
           <Field label="LinkedIn URL" value={current?.linkedin || ''} onChange={v => updateSection('socialLinks', {...current, linkedin: v})} />
           <Field label="GitHub URL" value={current?.github || ''} onChange={v => updateSection('socialLinks', {...current, github: v})} />
        </div>
      );
    default:
      return <ListView items={current || []} onUpdate={(v: any) => updateSection(sectionId, v)} sectionId={sectionId} />;
  }
};
