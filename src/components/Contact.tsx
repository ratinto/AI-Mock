import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Contact — Support/Contact page with form validation and FAQ.
 *
 * System Design Concepts:
 *
 *  1. INPUT VALIDATION PATTERN:
 *     - Client-side validation before submission.
 *     - Validates required fields, email format, and minimum lengths.
 *     - Provides real-time error feedback per field.
 *
 *  2. FORM STATE MANAGEMENT:
 *     - Manages form data, error state, and submission state.
 *     - Demonstrates controlled components pattern.
 *
 *  3. SEPARATION OF CONCERNS:
 *     - Validation logic is separated from rendering.
 *     - FAQ data is separated from the component logic.
 *
 *  4. DEFENSIVE PROGRAMMING:
 *     - Trims inputs, checks for empty strings, validates email regex.
 *     - Prevents invalid data from being submitted.
 */

/** FAQ data — separated from component for maintainability */
const FAQ_ITEMS = [
  {
    question: 'How does the AI interview work?',
    answer:
      'Our AI analyzes your responses in real-time, providing feedback on content, delivery, and structure. It adapts questions based on your performance and the role you\'re preparing for.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use industry-standard encryption for all data in transit and at rest. Your interview recordings and resume data are never shared with third parties.',
  },
  {
    question: 'Can I use AntriView for free?',
    answer:
      'Yes! Our Starter plan includes 3 mock interviews per month, basic skill analysis, and access to public templates — completely free.',
  },
  {
    question: 'How do I reset my password?',
    answer:
      'Go to Settings → Account → Change Password. Enter your current password and set a new one. If you\'ve forgotten your password, use the "Forgot Password" link on the login page.',
  },
];

/** Form field types */
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/** Email validation regex — standard RFC 5322 simplified pattern */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  /**
   * Validate form fields — Defensive Programming.
   * Returns an errors object. If empty = valid.
   */
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    return newErrors;
  };

  /** Handle form submission */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors and show success
    setErrors({});
    setIsSubmitted(true);
  };

  /** Update a single field */
  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div style={styles.container}>
        <div className="animate-fade" style={styles.successContent}>
          <div style={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 style={styles.successTitle}>Message Sent!</h2>
          <p style={styles.successText}>
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <button onClick={() => navigate('/')} style={styles.primaryBtn}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="animate-fade" style={styles.wrapper}>
        {/* Back button */}
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Home
        </button>

        <div style={styles.layout}>
          {/* Left: Contact Form */}
          <div style={styles.formSection}>
            <h1 style={styles.heading}>Get in Touch</h1>
            <p style={styles.subheading}>
              Have a question or need support? We'd love to hear from you.
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Name */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  style={{
                    ...styles.input,
                    borderColor: errors.name ? '#ef4444' : 'var(--border-glass)',
                  }}
                />
                {errors.name && <span style={styles.errorText}>{errors.name}</span>}
              </div>

              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  style={{
                    ...styles.input,
                    borderColor: errors.email ? '#ef4444' : 'var(--border-glass)',
                  }}
                />
                {errors.email && <span style={styles.errorText}>{errors.email}</span>}
              </div>

              {/* Subject */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Subject</label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  style={{
                    ...styles.input,
                    borderColor: errors.subject ? '#ef4444' : 'var(--border-glass)',
                  }}
                />
                {errors.subject && <span style={styles.errorText}>{errors.subject}</span>}
              </div>

              {/* Message */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Message</label>
                <textarea
                  placeholder="Describe your question or issue..."
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  rows={5}
                  style={{
                    ...styles.input,
                    ...styles.textarea,
                    borderColor: errors.message ? '#ef4444' : 'var(--border-glass)',
                  }}
                />
                {errors.message && <span style={styles.errorText}>{errors.message}</span>}
              </div>

              <button type="submit" style={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </div>

          {/* Right: FAQ Section */}
          <div style={styles.faqSection}>
            <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
            <div style={styles.faqList}>
              {FAQ_ITEMS.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.faqItem,
                    borderColor:
                      openFaqIndex === index
                        ? 'rgba(99, 102, 241, 0.3)'
                        : 'var(--border-glass)',
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    style={styles.faqQuestion}
                  >
                    <span>{faq.question}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transition: 'transform 0.2s ease',
                        transform: openFaqIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                        flexShrink: 0,
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openFaqIndex === index && (
                    <div className="animate-fade" style={styles.faqAnswer}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact info card */}
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>Other ways to reach us</h3>
              <div style={styles.infoItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>support@antriview.ai</span>
              </div>
              <div style={styles.infoItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Mon–Fri, 9 AM – 6 PM IST</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-dark, #050505)',
    padding: '40px 60px',
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    padding: '8px 0',
    marginBottom: '40px',
    transition: 'color 0.2s ease',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '80px',
    alignItems: 'start',
  },
  formSection: {},
  heading: {
    fontSize: '2.5rem',
    fontWeight: 900,
    letterSpacing: '-0.04em',
    marginBottom: '12px',
    background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subheading: {
    color: 'var(--text-muted)',
    fontSize: '1.05rem',
    lineHeight: 1.6,
    marginBottom: '40px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    letterSpacing: '0.02em',
  },
  input: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-glass)',
    borderRadius: '14px',
    padding: '14px 18px',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    width: '100%',
  },
  textarea: {
    resize: 'vertical' as const,
    minHeight: '120px',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.78rem',
    fontWeight: 600,
  },
  submitBtn: {
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '14px',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    alignSelf: 'flex-start',
  },
  faqSection: {
    paddingTop: '8px',
  },
  faqTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    marginBottom: '24px',
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },
  faqItem: {
    border: '1px solid var(--border-glass)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'border-color 0.2s ease',
  },
  faqQuestion: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '16px 20px',
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    textAlign: 'left',
  },
  faqAnswer: {
    padding: '0 20px 16px',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    lineHeight: 1.7,
  },
  infoCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-glass)',
    borderRadius: '20px',
    padding: '24px',
  },
  infoTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '16px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    marginBottom: '12px',
  },
  successContent: {
    textAlign: 'center',
    maxWidth: '400px',
    margin: '120px auto 0',
  },
  successIcon: {
    marginBottom: '24px',
  },
  successTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#ffffff',
    marginBottom: '12px',
  },
  successText: {
    color: 'var(--text-muted)',
    lineHeight: 1.6,
    marginBottom: '32px',
  },
  primaryBtn: {
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '14px',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

export default Contact;
