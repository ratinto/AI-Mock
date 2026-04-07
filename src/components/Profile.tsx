import React, { useState } from 'react';
import { User, Mail, CheckCircle, Shield } from 'lucide-react';
import type { UserData } from '../domain/user';
import { useServices } from '../app/ServicesProvider';

interface ProfileProps {
  user: UserData;
  onUpdate: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const { profile } = useServices();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update name
    profile.updateUser(user.email, { name });
    
    // Handle password update simulation
    if (newPassword && currentPassword) {
      profile.updateUser(user.email, { password: newPassword });
    }

    setIsSaved(true);
    onUpdate(); // Trigger dashboard refresh

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Account Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information and security.</p>
      </header>

      <div style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Profile Section */}
          <section className="dash-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="#3b82f6" /> Personal Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      outline: 'none'
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    value={user.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      cursor: 'not-allowed'
                    }} 
                  />
                  <Mail size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                </div>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="dash-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={20} color="#10b981" /> Security
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      outline: 'none'
                    }} 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>New Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      outline: 'none'
                    }} 
                  />
                </div>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button type="submit" className="btn-white" style={{ padding: '14px 40px' }}>
              Save Changes
            </button>
            
            {isSaved && (
              <div className="animate-fade" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600 }}>
                <CheckCircle size={20} /> Changes saved successfully!
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
