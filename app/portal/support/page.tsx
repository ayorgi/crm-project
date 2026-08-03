'use client';
import React, { useState, useEffect } from 'react';
import {
  Phone, MessageCircle, Mail, ChevronDown, ChevronUp,
  Send, Clock, CheckCircle2, AlertCircle,
  Headphones, FileText, Car, CreditCard, Star,
  Ticket, X, Loader2, ShieldCheck, Plane
} from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'airport',
    label: 'Flight & Airport Meet',
    questions: [
      {
        q: 'What happens if my flight is delayed?',
        a: 'We track all flights in real time. Your chauffeur will always wait for you at no extra charge, regardless of how late your flight arrives. Simply board and we handle the rest.',
      },
      {
        q: 'How will I find my driver at the airport?',
        a: 'Your professionally-dressed chauffeur will be waiting at the arrivals hall holding a name board with your name (or company name if specified in your profile). They will be present from the moment your flight lands.',
      },
      {
        q: 'Can I update my Meet & Greet name after booking?',
        a: 'Yes. You can update your Meet & Greet name at any time via Profile → VIP Preferences → Airport Meet & Greet Signage Name, or contact our concierge team directly.',
      },
    ],
  },
  {
    id: 'vehicle',
    label: 'Vehicle & Comfort',
    questions: [
      {
        q: 'Are in-cabin amenities (Wi-Fi, water, etc.) included?',
        a: 'All VIP Business Van and First Class Sedan services include bottled still water, phone chargers, and complimentary Wi-Fi as standard. Additional preferences can be set in your VIP Cabin Preferences.',
      },
      {
        q: 'How do I request a child or infant seat?',
        a: 'Child and infant seat requests can be added at any time from Profile → VIP Preferences → Child Seat Requirement. We offer Infant Seat (0-12 months), Child Safety Seat (1-4 years), and Booster Seat (4-8 years).',
      },
      {
        q: 'How many pieces of luggage can I bring?',
        a: 'VIP Business Van: up to 6 large suitcases. Executive Sedan / First Class Sedan: up to 3 large suitcases. For oversized or excess luggage, please open a support ticket in advance.',
      },
    ],
  },
  {
    id: 'billing',
    label: 'Cancellation & Billing',
    questions: [
      {
        q: 'What is the free cancellation policy?',
        a: 'You may cancel any transfer free of charge up to 24 hours before the scheduled pick-up time. Cancellations within 24 hours may be subject to a 50% service fee.',
      },
      {
        q: 'When will I receive my corporate invoice?',
        a: 'Invoices are automatically generated and available in your Receipts section immediately after each completed transfer. Official PDF invoices can be downloaded at any time.',
      },
      {
        q: 'Can I modify a booking after confirmation?',
        a: 'Booking modifications (date, time, vehicle type) are accepted up to 4 hours before pick-up, subject to availability. Please contact our concierge team via WhatsApp or phone for fastest assistance.',
      },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback & Requests',
    questions: [
      {
        q: 'How do I submit feedback about my transfer experience?',
        a: 'We genuinely value your feedback. Open a support ticket using the "Feedback & Review" topic, or contact us directly via WhatsApp. Your comments are reviewed by our service quality team within 24 hours.',
      },
      {
        q: 'Can I request a specific chauffeur for future bookings?',
        a: 'Yes. Please open a support ticket with the "Special Request" topic and mention the chauffeur name or previous booking ID. We will do our best to accommodate subject to availability.',
      },
    ],
  },
];

const TICKET_TOPICS = [
  'Transfer Modification',
  'Flight Delay Notification',
  'Invoice & Billing',
  'Special Cabin Request',
  'Lost Item',
  'Feedback & Review',
  'Other',
];

const MOCK_TICKETS = [
  {
    id: 'TK-8492',
    topic: 'Flight Delay Notification',
    message: 'My flight LCA-8821 has been delayed by 2 hours. Please inform the driver.',
    status: 'Resolved',
    date: '2026-07-24',
    response: 'Your chauffeur has been notified and will wait at the updated arrival time. No extra charge applies.',
  },
  {
    id: 'TK-8501',
    topic: 'Invoice & Billing',
    message: 'Please update the company name on invoice #INV-62-78 to Kaya Holding Ltd.',
    status: 'In Progress',
    date: '2026-07-28',
    response: null,
  },
];

export default function SupportPage() {
  const [customerName, setCustomerName] = useState('Guest');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string>('airport');
  const [ticketTopic, setTicketTopic] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tickets, setTickets] = useState<any[]>(MOCK_TICKETS);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
    const name = profile.firstName
      ? `${profile.firstName} ${profile.lastName}`.trim()
      : localStorage.getItem('currentCustomer') || 'Guest';
    setCustomerName(name);
  }, []);

  const toggleFaq = (id: string) => setOpenFaq(openFaq === id ? null : id);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTopic || !ticketMessage.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const newTicket = {
      id: `TK-${8502 + tickets.length}`,
      topic: ticketTopic,
      message: ticketMessage,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      response: null,
    };
    setTickets(prev => [newTicket, ...prev]);
    setSubmitting(false);
    setSubmitted(true);
    setTicketTopic('');
    setTicketMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
      Open: 'bg-sky-50 text-sky-700 border-sky-200',
      Closed: 'bg-slate-100 text-slate-500 border-slate-200',
    };
    const icons: Record<string, React.ReactNode> = {
      Resolved: <CheckCircle2 className="w-3 h-3" />,
      'In Progress': <Clock className="w-3 h-3" />,
      Open: <AlertCircle className="w-3 h-3" />,
      Closed: <X className="w-3 h-3" />,
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${styles[status] || styles['Open']}`}>
        {icons[status]} {status}
      </span>
    );
  };

  const inpClass = "w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium focus:border-[#aa2d29] focus:bg-white focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-slate-900 placeholder:text-slate-400";

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-8">

      {/* SECTION 1: VIP CONTACT CHANNELS */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-white shadow-md">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Headphones className="w-5 h-5 text-[#aa2d29]" />
            <h1 className="text-2xl font-bold font-heading tracking-tight">VIP Concierge Support</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Our team is available around the clock for you, {customerName}. Choose your preferred contact channel below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="tel:+905001234567"
            className="flex flex-col items-start gap-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-[#aa2d29]/60 rounded-2xl p-5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#aa2d29]/20 flex items-center justify-center border border-[#aa2d29]/30 group-hover:bg-[#aa2d29]/30 transition-colors">
              <Phone className="w-5 h-5 text-[#aa2d29]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">24/7 Hotline</p>
              <p className="text-sm font-bold text-white">+90 500 123 4567</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Immediate voice support</p>
            </div>
          </a>

          <a
            href="https://wa.me/905001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-start gap-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/60 rounded-2xl p-5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500/25 transition-colors">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">WhatsApp</p>
              <p className="text-sm font-bold text-white">Live Chat Assist</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Fastest response channel</p>
            </div>
          </a>

          <a
            href="mailto:concierge@transfercrm.com"
            className="flex flex-col items-start gap-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-400/60 rounded-2xl p-5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center border border-sky-500/30 group-hover:bg-sky-500/25 transition-colors">
              <Mail className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email</p>
              <p className="text-sm font-bold text-white">concierge@transfercrm.com</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Invoices & formal requests</p>
            </div>
          </a>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-xs text-slate-400 font-medium">
            Average response time: <span className="text-white font-semibold">under 5 minutes</span> via WhatsApp
            {' · '}
            <span className="text-white font-semibold">under 2 hours</span> via email.
          </p>
        </div>
      </div>

      {/* SECTION 3: FAQ */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="bg-slate-900 px-8 py-5 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#aa2d29]" /> Frequently Asked Questions
          </h2>
        </div>

        <div className="flex overflow-x-auto border-b border-slate-100 px-6 pt-4 gap-2">
          {FAQ_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setOpenCategory(cat.id); setOpenFaq(null); }}
              className={`px-4 py-2 rounded-t-xl text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                openCategory === cat.id
                  ? 'border-[#aa2d29] text-[#aa2d29] bg-rose-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="divide-y divide-slate-100">
          {FAQ_CATEGORIES.find(c => c.id === openCategory)?.questions.map((item, idx) => {
            const id = `${openCategory}-${idx}`;
            const isOpen = openFaq === id;
            return (
              <div key={id}>
                <button
                  onClick={() => toggleFaq(id)}
                  className="w-full flex items-start justify-between gap-4 px-8 py-5 text-left hover:bg-slate-50/60 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-900 leading-snug">{item.q}</span>
                  {isOpen
                    ? <ChevronUp className="w-4 h-4 text-[#aa2d29] shrink-0 mt-0.5" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                </button>
                {isOpen && (
                  <div className="px-8 pb-5 animate-in fade-in duration-150">
                    <p className="text-sm text-slate-600 font-medium leading-relaxed border-l-2 border-[#aa2d29] pl-4">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: CREATE SUPPORT TICKET */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="bg-slate-900 px-8 py-5 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#aa2d29]" /> Open a Support Ticket
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {"Couldn't find what you were looking for? Send us a message and we'll get back to you."}
          </p>
        </div>

        <form onSubmit={handleSubmitTicket} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Topic *</label>
            <select
              required
              value={ticketTopic}
              onChange={e => setTicketTopic(e.target.value)}
              className={inpClass}
            >
              <option value="">Select a topic...</option>
              {TICKET_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message *</label>
            <textarea
              required
              rows={5}
              placeholder="Please describe your request in detail. Include booking IDs, flight numbers, or any relevant information..."
              value={ticketMessage}
              onChange={e => setTicketMessage(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium focus:border-[#aa2d29] focus:bg-white focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-slate-900 placeholder:text-slate-400 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Expected response within 2 hours
            </p>
            <button
              type="submit"
              disabled={submitting || submitted}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs active:scale-95 ${
                submitted
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-[#aa2d29] hover:bg-[#8e2622] text-white shadow-[#aa2d29]/20'
              }`}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : submitted ? (
                <><CheckCircle2 className="w-4 h-4" /> Ticket Submitted!</>
              ) : (
                <><Send className="w-4 h-4" /> Submit Ticket</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 5: MY SUPPORT TICKETS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="bg-slate-900 px-8 py-5 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#aa2d29]" /> My Support Tickets
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{tickets.length} total ticket{tickets.length !== 1 ? 's' : ''}</p>
        </div>

        {tickets.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
              <Ticket className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500">No support tickets yet</p>
            <p className="text-xs text-slate-400 mt-1">Your submitted tickets will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map(ticket => (
              <div key={ticket.id} className="px-8 py-5 hover:bg-slate-50/40 transition-colors">
                <button
                  onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        #{ticket.id} — {ticket.topic}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Submitted {ticket.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {getStatusBadge(ticket.status)}
                    {expandedTicket === ticket.id
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {expandedTicket === ticket.id && (
                  <div className="mt-4 space-y-3 animate-in fade-in duration-150">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Message</p>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">{ticket.message}</p>
                    </div>
                    {ticket.response ? (
                      <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
                        <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3" /> Concierge Response
                        </p>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed">{ticket.response}</p>
                      </div>
                    ) : (
                      <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-700 font-medium">Awaiting response from our concierge team. Expected within 2 hours.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
