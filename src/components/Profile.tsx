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
      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '4px', fontWeight: 600 }}>
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
            borderRadius: '14px',
            background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${error ? 'rgba(239, 68, 68, 0.45)' : 'var(--border-subtle)'}`,
            color: disabled ? 'var(--text-secondary)' : '#fff',
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'text',
            boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
          }}
        />
        {rightAdornment && (
          <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', opacity: disabled ? 0.35 : 0.6 }}>
            {rightAdornment}
          </div>
        )}
      </div>
      {error ? (
        <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>{error}</div>
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
    <section className="dash-card glass-effect" style={{ padding: '30px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '18px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.2px' }}>{title}</div>
            {subtitle && <div style={{ marginTop: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{subtitle}</div>}
          </div>
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
  const [error, setError] = useState<string | null>(null);
  const { profile } = useServices();

  const handleSave = (e: React.FormEvent) => {
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

    profile.updateUser(user.email, { name: trimmedName });
    if (wantsPasswordChange) profile.updateUser(user.email, { password: newPassword.trim() });

    setIsSaved(true);
    onUpdate(); // Trigger dashboard refresh
    setCurrentPassword('');
    setNewPassword('');

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
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
      <header style={{ marginBottom: '26px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.8px' }}>Account Settings</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Update your profile and security preferences.</p>
        </div>
        {isSaved && (
          <div className="animate-fade" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontWeight: 700 }}>
            <CheckCircle size={20} /> Saved
          </div>
        )}
      </header>

      <form onSubmit={handleSave} style={{ maxWidth: '980px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '22px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <SettingsSection
              icon={<User size={18} color="#3b82f6" />}
              title="Personal information"
              subtitle="This is how your name appears across the dashboard."
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <Field
                  label="Full name"
                  value={name}
                  onChange={(v) => {
                    setName(v);
                    if (nameError) setError(null);
                  }}
                  error={nameError}
                  placeholder="Your name"
                />
                <Field
                  label="Email address"
                  value={user.email}
                  disabled
                  rightAdornment={<Mail size={16} />}
                  hint="Email can’t be changed for this demo."
                />
              </div>
            </SettingsSection>

            <SettingsSection
              icon={<Shield size={18} color="#10b981" />}
              title="Security"
              subtitle="Change your password (demo only). Leave blank to keep it unchanged."
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <Field
                  label="Current password"
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
                  label="New password"
                  type="password"
                  placeholder="Enter new password"
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <section className="dash-card glass-effect" style={{ padding: '28px' }}>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '10px' }}>Changes</div>
              <div style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Review your updates, then save. You can reset anytime before saving.
              </div>

              <div style={{ marginTop: '18px', padding: '14px', borderRadius: '16px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>Name</span>
                  <span style={{ color: '#fff', fontWeight: 700, maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {name.trim() || '—'}
                  </span>
                </div>
                <div style={{ height: '10px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>Password</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>
                    {currentPassword || newPassword ? 'Will be updated' : 'Unchanged'}
                  </span>
                </div>
              </div>

              {error && !nameError && !passwordError && (
                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', fontWeight: 700 }}>
                  <AlertTriangle size={18} /> {error}
                </div>
              )}

              <div style={{ marginTop: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={onReset}
                  disabled={!isDirty}
                  style={{ opacity: !isDirty ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                  <RotateCcw size={16} /> Reset
                </button>
                <button
                  type="submit"
                  className="btn-white"
                  disabled={!isDirty}
                  style={{ opacity: !isDirty ? 0.65 : 1, display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                  <Save size={16} /> Save changes
                </button>
              </div>
            </section>

            <section className="dash-card" style={{ padding: '24px' }}>
              <div style={{ fontWeight: 900, marginBottom: '8px' }}>Tip</div>
              <div style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Use a real name—your dashboard greeting and reports use it.
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
