import React, { useMemo, useState } from 'react';
import { User, Mail, CheckCircle, Shield, KeyRound, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import type { UserData } from '../domain/user';
import { useServices } from '../app/ServicesProvider';

interface ProfileProps {
  user: UserData;
  onUpdate: () => void;
}

type FieldProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  disabled?: boolean;
  rightAdornment?: React.ReactNode;
  hint?: string;
  error?: string | null;
};

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
  rightAdornment,
  hint,
  error,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: '100%',
            padding: rightAdornment ? '12px 44px 12px 16px' : '12px 16px',
            borderRadius: '12px',
            background: disabled ? 'var(--bg-secondary)' : '#fff',
            border: `1px solid ${error ? '#ef4444' : 'var(--border-subtle)'}`,
            color: disabled ? 'var(--text-muted)' : 'var(--text-main)',
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'text',
            boxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.1)' : 'none',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease'
          }}
        />
        {rightAdornment && (
          <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            {rightAdornment}
          </div>
        )}
      </div>
      {error ? (
        <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>{error}</div>
      ) : hint ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{hint}</div>
      ) : null}
    </div>
  );
};

type SettingsSectionProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const SettingsSection: React.FC<SettingsSectionProps> = ({ icon, title, subtitle, children }) => {
  return (
    <section className="dash-card" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)'
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{title}</div>
          {subtitle && <div style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{subtitle}</div>}
        </div>
      </div>
      {children}
    </section>
  );
};

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useServices();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const wantsPasswordChange = Boolean(currentPassword.trim() || newPassword.trim());

    if (!trimmedName) {
      setError('Name cannot be empty.');
      return;
    }

    if (wantsPasswordChange) {
      if (!currentPassword.trim() || !newPassword.trim()) {
        setError('To change your password, fill both current and new password.');
        return;
      }
      if (newPassword.trim().length < 6) {
        setError('New password must be at least 6 characters.');
        return;
      }
    }

    setError(null);

    try {
      setIsSaving(true);
      await profile.updateUser(user.email, {
        name: trimmedName,
        ...(wantsPasswordChange ? { password: newPassword.trim() } : {}),
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save profile');
      setIsSaving(false);
      return;
    }

    setIsSaved(true);
    onUpdate(); 
    setCurrentPassword('');
    setNewPassword('');

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
    setIsSaving(false);
  };

  const onReset = () => {
    setName(user.name);
    setCurrentPassword('');
    setNewPassword('');
    setIsSaved(false);
    setError(null);
  };

  const isDirty = useMemo(() => {
    return name !== user.name || Boolean(currentPassword) || Boolean(newPassword);
  }, [currentPassword, name, newPassword, user.name]);

  const passwordError =
    error && (error.toLowerCase().includes('password') || error.toLowerCase().includes('current') || error.toLowerCase().includes('new'))
      ? error
      : null;
  const nameError = error && error.toLowerCase().includes('name') ? error : null;

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '8px' }}>Security & Profile</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Full control over your workspace identity and safety.</p>
        </div>
        {isSaved && (
          <div className="animate-fade" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
            <CheckCircle size={18} /> Changes Applied
          </div>
        )}
      </header>

      <form onSubmit={handleSave} style={{ maxWidth: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <SettingsSection
              icon={<User size={18} />}
              title="Personal Information"
              subtitle="This is how you'll be identified in interview reports."
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Field
                  label="Display name"
                  value={name}
                  onChange={(v) => {
                    setName(v);
                    if (nameError) setError(null);
                  }}
                  error={nameError}
                  placeholder="Your name"
                />
                <Field
                  label="Account Email"
                  value={user.email}
                  disabled
                  rightAdornment={<Mail size={16} />}
                  hint="Connected email address."
                />
              </div>
            </SettingsSection>

            <SettingsSection
              icon={<Shield size={18} />}
              title="Security"
              subtitle="Update your authentication credentials."
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Field
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(v) => {
                    setCurrentPassword(v);
                    if (passwordError) setError(null);
                  }}
                  rightAdornment={<KeyRound size={16} />}
                  error={passwordError}
                />
                <Field
                  label="New Password"
                  type="password"
                  placeholder="Choose new password"
                  value={newPassword}
                  onChange={(v) => {
                    setNewPassword(v);
                    if (passwordError) setError(null);
                  }}
                  error={passwordError}
                  hint="Minimum 6 characters."
                />
              </div>
            </SettingsSection>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <section className="dash-card" style={{ padding: '32px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '12px' }}>Pending Updates</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Review your changes carefully before committing to the database.
              </p>

              <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-secondary)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
                  <span>NAME</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
                    {name.trim() || '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span>PASSWORD</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
                    {currentPassword || newPassword ? 'Updated' : 'Unchanged'}
                  </span>
                </div>
              </div>

              {error && !nameError && !passwordError && (
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 600, fontSize: '0.9rem' }}>
                  <AlertTriangle size={16} /> {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-white"
                  onClick={onReset}
                  disabled={!isDirty}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <RotateCcw size={16} /> Reset
                </button>
                <button
                  type="submit"
                  className="btn-black"
                  disabled={!isDirty || isSaving}
                  style={{ flex: 2, justifyContent: 'center', opacity: isSaving ? 0.7 : 1 }}
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </section>

            <div className="dash-card" style={{ padding: '24px', background: 'transparent', borderStyle: 'dashed' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>Security Tip</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Regularly updating your password and using unique credentials for career platforms helps protect your professional data.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
