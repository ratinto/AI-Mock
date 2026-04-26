import React from 'react';

export const ResumePreviewContent: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="academic-theme">
      <header style={{ marginBottom: '20pt' }}>
        <h1 style={{ fontSize: '24pt', marginBottom: '4pt' }}>{data.general?.name || 'Identity Name'}</h1>
        <div style={{ fontSize: '10pt', display: 'flex', flexDirection: 'column', gap: '2pt' }}>
           <div><strong>Phone:</strong> {data.general?.phone || '+91 0000000000'}</div>
           <div><strong>Email:</strong> {data.general?.email || 'email@example.com'}</div>
           <div style={{ display: 'flex', gap: '8pt', marginTop: '4pt' }}>
              {data.socialLinks?.linkedin && <a href={data.socialLinks.linkedin}>LinkedIn</a>}
              {data.socialLinks?.github && <span>• <a href={data.socialLinks.github}>Github</a></span>}
           </div>
        </div>
      </header>

      {data.general?.summary && (
         <section>
            <div className="section-h">Professional Summary</div>
            <p style={{ fontSize: '10pt', lineHeight: '1.5', textAlign: 'justify' }}>{data.general.summary}</p>
         </section>
      )}

      {data.education?.length > 0 && (
         <section>
            <div className="section-h">Education</div>
            {data.education.map((edu: any, i: number) => (
               <div key={i} style={{ marginBottom: '10pt' }}>
                  <div className="row-flex"><span>{edu.degree}</span><span>{edu.end_date}</span></div>
                  <div className="row-sub"><span style={{ fontStyle: 'italic' }}>{edu.institution}</span><strong>Grade: {edu.grade}</strong></div>
               </div>
            ))}
         </section>
      )}

      {data.experience?.length > 0 && (
         <section>
            <div className="section-h">Internships</div>
            {data.experience.map((exp: any, i: number) => (
               <div key={i} style={{ marginBottom: '12pt' }}>
                  <div className="row-flex"><span>{exp.role}</span><span>{exp.start_date} - {exp.end_date}</span></div>
                  <div className="row-sub"><span style={{ fontStyle: 'italic' }}>{exp.company}</span>{exp.incubated && <span style={{ fontStyle: 'italic' }}>{exp.incubated}</span>}</div>
                  {exp.description && (
                     <div className="bullet-list">
                        {(exp.description.split('\n') || []).map((line: string, li: number) => (
                           <div key={li} className="bullet-item">{line}</div>
                        ))}
                     </div>
                  )}
               </div>
            ))}
         </section>
      )}

      {data.projects?.length > 0 && (
         <section>
            <div className="section-h">Projects</div>
            {data.projects.map((proj: any, i: number) => (
               <div key={i} style={{ marginBottom: '14pt' }}>
                  <div className="row-flex"><span>{proj.name} ({proj.github && <a href={proj.github}>Github</a>}{proj.demo && <> ) ( <a href={proj.demo}>Demo</a></>})</span><span>{proj.date}</span></div>
                  <div style={{ fontSize: '10pt', fontWeight: 700, margin: '2pt 0' }}>Tech Stacks — <span style={{ fontWeight: 400 }}>{(proj.technologies || [])?.join?.(', ')}</span></div>
                  {proj.description && (
                     <div className="bullet-list">
                        {(proj.description.split('\n') || []).map((line: string, li: number) => (
                           <div key={li} className="bullet-item">{line}</div>
                        ))}
                     </div>
                  )}
               </div>
            ))}
         </section>
      )}

      {data.skills?.length > 0 && (
         <section>
            <div className="section-h">Skills</div>
            {data.skills.map((skill: any, i: number) => (
               <div key={i} style={{ fontSize: '10pt', marginBottom: '4pt' }}>
                  <strong>{skill.category}:</strong> {skill.items?.join?.(', ')}
               </div>
            ))}
         </section>
      )}
    </div>
  );
};
