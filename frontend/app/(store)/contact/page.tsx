'use client';

import { useState } from 'react';
import Link from 'next/link';

const CONTACT_INFO = [
  {
    icon: '📧',
    title: 'Email Us',
    value: 'support@sole.com',
    sub: 'We reply within 24 hours',
  },
  {
    icon: '📞',
    title: 'Call Us',
    value: '+1 (555) 012-3456',
    sub: 'Mon–Fri, 9am–6pm EST',
  },
  {
    icon: '📍',
    title: 'Visit Us',
    value: '123 Performance Way',
    sub: 'New York, NY 10001',
  },
];

const SOCIALS = [
  { label: 'Instagram', icon: '📷' },
  { label: 'X / Twitter', icon: '✕' },
  { label: 'TikTok', icon: '🎵' },
  { label: 'Facebook', icon: 'f' },
];

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 3–5 business days. Express shipping (1–2 business days) is available at checkout for an additional fee.',
  },
  {
    q: "What's your return policy?",
    a: "We offer 60-day free returns on all unworn items in original packaging. Refunds are processed within 5–7 business days of receipt.",
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes — we currently ship to 12 countries. International shipping times and rates are calculated at checkout based on destination.',
  },
  {
    q: 'How do I find my correct size?',
    a: 'Check our Size Guide on any product page. If you\'re between sizes, we generally recommend sizing up for the most comfortable fit.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: "Orders can be modified within 1 hour of placing them. After that, our fulfillment team has already begun processing. Contact support immediately if you need help.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<typeof form> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.subject.trim()) next.subject = 'Subject is required';
    if (!form.message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 2500);
  }

  const inputClass = 'w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-150 placeholder:opacity-50';
  const labelClass = 'block text-[0.7rem] font-bold uppercase tracking-wider mb-2.5';

  function fieldStyle(hasError?: boolean) {
    return {
      background: 'var(--surface)',
      color: 'var(--text)',
      border: `1.5px solid ${hasError ? 'var(--danger)' : 'var(--border2)'}`,
    };
  }

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* Hero */}
      <section className="max-w-[1300px] mx-auto px-6 sm:px-8 pt-20 pb-14 sm:pt-24 sm:pb-16 text-center">
        <p
          className="text-xs font-bold uppercase tracking-[0.25em] mb-4"
          style={{ color: 'var(--accent)' }}
        >
          Get In Touch
        </p>
        <h1
          className="font-['Playfair_Display'] text-4xl sm:text-6xl font-bold mb-6"
          style={{ color: 'var(--text)' }}
        >
          We're here to help.
        </h1>
        <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: 'var(--text2)' }}>
          Questions about an order, a return, or just want to talk shoes? Drop us a line — a real
          human will get back to you.
        </p>
      </section>

      {/* Contact info cards */}
      <section className="max-w-[1300px] mx-auto px-6 sm:px-8 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {CONTACT_INFO.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                style={{ background: 'var(--accent-light)' }}
              >
                {c.icon}
              </div>
              <h3
                className="text-xs font-bold uppercase tracking-wide mb-2"
                style={{ color: 'var(--text2)' }}
              >
                {c.title}
              </h3>
              <p className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>
                {c.value}
              </p>
              <p className="text-sm" style={{ color: 'var(--text3)' }}>
                {c.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Socials */}
      <section className="max-w-[1300px] mx-auto px-6 sm:px-8 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">

          {/* Contact form */}
          <div
            className="rounded-3xl p-7 sm:p-9 shadow-sm"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="py-16 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{ background: '#27AE60', color: '#fff' }}
                >
                  ✓
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
                  Message sent
                </h3>
                <p className="text-sm" style={{ color: 'var(--text2)' }}>
                  Thanks for reaching out — we'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass} style={{ color: 'var(--text2)' }}>Name</label>
                    <input
                      className={inputClass}
                      style={fieldStyle(!!errors.name)}
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Jane Doe"
                    />
                    {errors.name && <p className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: 'var(--text2)' }}>Email</label>
                    <input
                      type="email"
                      className={inputClass}
                      style={fieldStyle(!!errors.email)}
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="jane@example.com"
                    />
                    {errors.email && <p className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass} style={{ color: 'var(--text2)' }}>Subject</label>
                  <input
                    className={inputClass}
                    style={fieldStyle(!!errors.subject)}
                    value={form.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    placeholder="Order inquiry, return request, etc."
                  />
                  {errors.subject && <p className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>{errors.subject}</p>}
                </div>

                <div>
                  <label className={labelClass} style={{ color: 'var(--text2)' }}>Message</label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    style={fieldStyle(!!errors.message)}
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="How can we help?"
                  />
                  {errors.message && <p className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="self-start px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'var(--text)', color: 'var(--bg)' }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Socials + Support note */}
          <div className="flex flex-col gap-6">
            <div
              className="rounded-3xl p-7 shadow-sm"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h3 className="text-base font-bold mb-5" style={{ color: 'var(--text)' }}>
                Follow Along
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {SOCIALS.map((s) => (
                  <button
                    key={s.label}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: 'var(--surface2)', color: 'var(--text)' }}
                  >
                    <span className="text-base">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="rounded-3xl p-7"
              style={{ background: 'var(--accent-light)' }}
            >
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>
                Need urgent help?
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>
                For order issues that need immediate attention, our live chat is the fastest way to
                reach us.
              </p>
              <button
                className="text-sm font-bold underline"
                style={{ color: 'var(--accent)' }}
              >
                Start Live Chat →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[900px] mx-auto px-6 sm:px-8 pb-16 sm:pb-20">
        <div className="text-center mb-10">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
            style={{ color: 'var(--accent)' }}
          >
            FAQ
          </p>
          <h2
            className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold"
            style={{ color: 'var(--text)' }}
          >
            Common Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={faq.q}
                className="rounded-2xl overflow-hidden transition-all duration-200"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                    {faq.q}
                  </span>
                  <span
                    className="text-lg flex-shrink-0 transition-transform duration-200"
                    style={{
                      color: 'var(--accent)',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1300px] mx-auto px-6 sm:px-8 pb-20">
        <div
          className="rounded-3xl px-8 sm:px-16 py-14 sm:py-16 text-center"
          style={{ background: 'var(--text)' }}
        >
          <h2
            className="font-['Playfair_Display'] text-2xl sm:text-4xl font-bold mb-4"
            style={{ color: '#fff' }}
          >
            Still have questions?
          </h2>
          <p className="text-sm sm:text-base mb-7" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Our support team is just an email away.
          </p>
          <Link
            href="mailto:support@sole.com"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Email Support →
          </Link>
        </div>
      </section>

    </div>
  );
}