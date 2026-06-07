import { useEffect, useState } from 'react';

const emptyContact = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const emptyVolunteer = {
  name: '',
  email: '',
  skills: '',
  availability: '',
};

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function StatCard({ stat }) {
  return (
    <article className="stat-card">
      <strong>{stat.value}</strong>
      <h3>{stat.label}</h3>
      <p>{stat.detail}</p>
    </article>
  );
}

function ProgramCard({ program }) {
  return (
    <article className="program-card">
      <p className="program-index">0{program.id}</p>
      <h3>{program.title}</h3>
      <p>{program.summary}</p>
      <span>{program.outcome}</span>
    </article>
  );
}

function QuoteCard({ quote }) {
  return (
    <article className="quote-card">
      <p>{quote.quote}</p>
      <div>
        <strong>{quote.name}</strong>
        <span>{quote.role}</span>
      </div>
    </article>
  );
}

export default function App() {
  const [home, setHome] = useState({
    organization: {
      name: 'She Can Foundation',
      tagline: '',
      mission: '',
      email: '',
      location: '',
    },
    stats: [],
    programs: [],
    testimonials: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactForm, setContactForm] = useState(emptyContact);
  const [volunteerForm, setVolunteerForm] = useState(emptyVolunteer);
  const [contactStatus, setContactStatus] = useState({ type: '', message: '' });
  const [volunteerStatus, setVolunteerStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const controller = new AbortController();

    async function loadHome() {
      try {
        const response = await fetch('/api/home', {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load site content.');
        }

        setHome(data);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadHome();

    return () => controller.abort();
  }, []);

  async function submitContact(event) {
    event.preventDefault();
    setContactStatus({ type: 'pending', message: 'Sending your message...' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not send your message.');
      }

      setContactForm(emptyContact);
      setContactStatus({ type: 'success', message: data.message });
    } catch (submitError) {
      setContactStatus({ type: 'error', message: submitError.message });
    }
  }

  async function submitVolunteer(event) {
    event.preventDefault();
    setVolunteerStatus({ type: 'pending', message: 'Submitting your interest...' });

    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(volunteerForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not submit your volunteer request.');
      }

      setVolunteerForm(emptyVolunteer);
      setVolunteerStatus({ type: 'success', message: data.message });
    } catch (submitError) {
      setVolunteerStatus({ type: 'error', message: submitError.message });
    }
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="brand-mark">SCF</p>
          <div>
            <strong>She Can Foundation</strong>
            <span>Women-led impact, built for growth.</span>
          </div>
        </div>

        <nav>
          <a href="#about">About</a>
          <a href="#programs">Programs</a>
          <a href="#impact">Impact</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="button button-dark" href="#contact">
          Partner With Us
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Nonprofit website starter</p>
            <h1>{home.organization.name}</h1>
            <p className="hero-tagline">{home.organization.tagline}</p>
            <p className="hero-description">{home.organization.mission}</p>

            <div className="hero-actions">
              <a className="button button-dark" href="#programs">
                Explore Programs
              </a>
              <a className="button button-light" href="#volunteer">
                Become a Volunteer
              </a>
            </div>

            <ul className="hero-notes">
              <li>{home.organization.location}</li>
              <li>{home.organization.email}</li>
            </ul>
          </div>

          <aside className="hero-panel">
            <p>What this site includes</p>
            <ul>
              <li>React frontend with polished storytelling sections</li>
              <li>Express API backed by SQLite</li>
              <li>Contact and volunteer forms that save into the database</li>
            </ul>
          </aside>
        </section>

        <section className="stats-strip" id="impact">
          {loading && <p className="loading-card">Loading foundation story...</p>}
          {!loading && error && <p className="error-card">{error}</p>}
          {!loading && !error && home.stats.map((stat) => <StatCard key={stat.id} stat={stat} />)}
        </section>

        <section className="content-grid" id="about">
          <div className="content-card intro-card">
            <SectionHeading
              eyebrow="About"
              title="A foundation built around dignity, access, and opportunity."
              description="This starter site is designed to help She Can Foundation present programs, capture interest, and grow a real supporter network."
            />

            <div className="feature-list">
              <article>
                <h3>Mission focused</h3>
                <p>Clear messaging that explains why the foundation exists and who it serves.</p>
              </article>
              <article>
                <h3>Action oriented</h3>
                <p>Forms for contact and volunteer requests that persist data in SQLite.</p>
              </article>
              <article>
                <h3>Easy to extend</h3>
                <p>Room for donor flows, blog posts, event pages, or an admin dashboard later.</p>
              </article>
            </div>
          </div>

          <div className="content-card spotlight-card">
            <p className="eyebrow">Built for growth</p>
            <h3>Ready for donors, volunteers, and program storytelling.</h3>
            <p>
              The frontend reads from the API, and the backend saves form submissions into the
              database so the site can grow into something real.
            </p>
          </div>
        </section>

        <section id="programs">
          <SectionHeading
            eyebrow="Programs"
            title="Programs that support women through every stage of growth."
            description="Use these starter program cards as a foundation. You can replace the copy with your real initiatives anytime."
          />

          <div className="program-grid">
            {home.programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Stories"
            title="A few voices from the community."
            description="Testimonials help the site feel human and show how the foundation's work lands in real lives."
          />

          <div className="quote-grid">
            {home.testimonials.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        </section>

        <section className="forms-section" id="volunteer">
          <div className="content-card form-card">
            <SectionHeading
              eyebrow="Volunteer"
              title="Join the volunteer network."
              description="Capture mentors, speakers, facilitators, and community champions."
            />

            <form onSubmit={submitVolunteer} className="stack-form">
              <label>
                Full name
                <input
                  value={volunteerForm.name}
                  onChange={(event) =>
                    setVolunteerForm({ ...volunteerForm, name: event.target.value })
                  }
                  placeholder="Your name"
                />
              </label>

              <label>
                Email
                <input
                  value={volunteerForm.email}
                  onChange={(event) =>
                    setVolunteerForm({ ...volunteerForm, email: event.target.value })
                  }
                  placeholder="you@example.com"
                  type="email"
                />
              </label>

              <label>
                Skills or experience
                <textarea
                  value={volunteerForm.skills}
                  onChange={(event) =>
                    setVolunteerForm({ ...volunteerForm, skills: event.target.value })
                  }
                  placeholder="Mentoring, design, fundraising, teaching, events, and more"
                  rows="4"
                />
              </label>

              <label>
                Availability
                <input
                  value={volunteerForm.availability}
                  onChange={(event) =>
                    setVolunteerForm({ ...volunteerForm, availability: event.target.value })
                  }
                  placeholder="Weekends, weekdays, evenings"
                />
              </label>

              <button className="button button-dark" type="submit">
                Send Volunteer Interest
              </button>

              {volunteerStatus.message && (
                <p className={`form-status ${volunteerStatus.type}`}>{volunteerStatus.message}</p>
              )}
            </form>
          </div>

          <div className="content-card form-card" id="contact">
            <SectionHeading
              eyebrow="Contact"
              title="Reach out to the foundation."
              description="Use this form for partnerships, event requests, donor questions, and general inquiries."
            />

            <form onSubmit={submitContact} className="stack-form">
              <label>
                Full name
                <input
                  value={contactForm.name}
                  onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })}
                  placeholder="Your name"
                />
              </label>

              <label>
                Email
                <input
                  value={contactForm.email}
                  onChange={(event) =>
                    setContactForm({ ...contactForm, email: event.target.value })
                  }
                  placeholder="you@example.com"
                  type="email"
                />
              </label>

              <label>
                Subject
                <input
                  value={contactForm.subject}
                  onChange={(event) =>
                    setContactForm({ ...contactForm, subject: event.target.value })
                  }
                  placeholder="Partnership, donation, event, or support"
                />
              </label>

              <label>
                Message
                <textarea
                  value={contactForm.message}
                  onChange={(event) =>
                    setContactForm({ ...contactForm, message: event.target.value })
                  }
                  placeholder="Tell us how you'd like to connect."
                  rows="5"
                />
              </label>

              <button className="button button-dark" type="submit">
                Send Message
              </button>

              {contactStatus.message && (
                <p className={`form-status ${contactStatus.type}`}>{contactStatus.message}</p>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <strong>She Can Foundation</strong>
          <p>{home.organization.mission}</p>
        </div>
        <div>
          <span>{home.organization.email}</span>
          <span>{home.organization.location}</span>
        </div>
      </footer>
    </div>
  );
}
