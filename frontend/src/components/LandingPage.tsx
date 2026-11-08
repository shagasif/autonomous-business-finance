import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  CircleDollarSign,
  Eye,
  Landmark,
  Menu,
  Moon,
  PieChart,
  ShieldCheck,
  Sparkles,
  Sun,
  Wallet,
  X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './LandingPage.css';

const dashboardHref = '/dashboard';
const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
];

const features = [
  {
    number: '01',
    title: 'Financial Overview',
    description: 'Get a clear picture of business revenue, expenses and overall financial health.',
    icon: CircleDollarSign,
  },
  {
    number: '02',
    title: 'Smart Budget Monitoring',
    description: 'Track budgets, monitor spending and identify potential overspending early.',
    icon: PieChart,
  },
  {
    number: '03',
    title: 'AI-Powered Insights',
    description: 'Turn financial data into meaningful insights for more informed decisions.',
    icon: Sparkles,
  },
  {
    number: '04',
    title: 'Autonomous Agents',
    description: 'Trigger intelligent agents to assist with financial workflows and operations.',
    icon: Bot,
  },
  {
    number: '05',
    title: 'Expense Tracking',
    description: 'Understand spending patterns and monitor where your money goes.',
    icon: Wallet,
  },
  {
    number: '06',
    title: 'Performance Analytics',
    description: 'Explore financial trends and monitor business performance visually.',
    icon: BarChart3,
  },
];

const steps = [
  { number: '01', title: 'Connect', description: 'Bring your financial information together.', icon: Landmark },
  { number: '02', title: 'Analyze', description: 'Understand your financial position through intelligent insights.', icon: Eye },
  { number: '03', title: 'Act', description: 'Make informed decisions and manage financial workflows.', icon: Activity },
];

export function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>('.landing-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <a className="landing-brand" href="#home" onClick={closeMenu} aria-label="Autonomous Finance home">
          <span className="landing-brand-mark"><Landmark size={20} strokeWidth={1.7} /></span>
          <span>Autonomous <strong>Finance</strong></span>
        </a>

        <nav className={`landing-nav-links${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item.href}
              className={activeSection === item.href ? 'is-active' : undefined}
              href={item.href}
              onClick={() => {
                setActiveSection(item.href);
                closeMenu();
              }}
            >
              {item.label}
            </a>
          ))}
          <a className="landing-mobile-login" href={dashboardHref}>Login</a>
          <a className="landing-mobile-cta" href={dashboardHref}>Get Started <ArrowRight size={15} /></a>
        </nav>

        <div className="landing-nav-actions">
          <button
            className="landing-theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a className="landing-login" href={dashboardHref}>Login</a>
          <a className="landing-button landing-button-primary landing-nav-cta" href={dashboardHref}>
            Get Started <ArrowRight size={15} />
          </a>
          <button
            className="landing-menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="home">
          <div className="landing-hero-art" aria-hidden="true" />
          <div className="landing-hero-grid" aria-hidden="true" />
          <div className="landing-hero-content">
            <div className="landing-hero-copy">
              <span className="landing-eyebrow"><span /> AUTONOMOUS FINANCE PLATFORM</span>
              <h1>Your Business Finances, <em>Intelligently Managed.</em></h1>
              <p>
                Take control of your business finances with an intelligent platform that helps you monitor
                performance, understand spending, track budgets and make smarter financial decisions.
              </p>
              <div className="landing-hero-actions">
                <a className="landing-button landing-button-primary" href={dashboardHref}>
                  Get Started <ArrowRight size={16} />
                </a>
                <a className="landing-button landing-button-glass" href={dashboardHref}>Login</a>
              </div>
              <div className="landing-trust-line">
                <span><Check size={14} /> Financial clarity</span>
                <span><Check size={14} /> Intelligent workflows</span>
              </div>
            </div>

            <div className="landing-preview-shell" aria-label="Live preview of the Autonomous Finance dashboard">
              <div className="landing-preview-topbar">
                <div className="landing-window-dots"><i /><i /><i /></div>
                <div className="landing-preview-label"><span /> LIVE PRODUCT PREVIEW</div>
                <a href={dashboardHref} aria-label="Open the full dashboard"><ArrowDownRight size={16} /></a>
              </div>
              <div className="landing-dashboard-frame">
                <iframe
                  src="/dashboard?preview=1"
                  title="Autonomous Finance dashboard preview"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <a className="landing-scroll-cue" href="#features" aria-label="Scroll to features">
            EXPLORE THE PLATFORM <ChevronDown size={14} />
          </a>
        </section>

        <section className="landing-section landing-features" id="features">
          <div className="landing-section-heading landing-reveal">
            <span className="landing-eyebrow">A CLEARER FINANCIAL PICTURE</span>
            <h2>Complete Financial Clarity.<br /><em>One Intelligent Platform.</em></h2>
            <p>Everything you need to understand, monitor and manage your business finances in one place.</p>
          </div>
          <div className="landing-feature-grid">
            {features.map(({ number, title, description, icon: Icon }, index) => (
              <article
                className="landing-feature-card landing-reveal"
                key={number}
                style={{ transitionDelay: `${index * 55}ms` }}
              >
                <div className="landing-feature-card-top">
                  <span className="landing-feature-number">{number}</span>
                  <span className="landing-feature-icon"><Icon size={20} strokeWidth={1.7} /></span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="landing-feature-rule" />
              </article>
            ))}
          </div>
        </section>

        <section className="landing-showcase" id="showcase">
          <div className="landing-showcase-copy landing-reveal">
            <span className="landing-eyebrow">THE PLATFORM, IN FOCUS</span>
            <h2>See Your Business<br /><em>Finances Differently.</em></h2>
            <p>
              One connected workspace brings financial summaries, revenue and expense monitoring, budget
              health, analytics, insights and autonomous agent controls into view.
            </p>
            <ul>
              <li><Check size={15} /> Financial summaries at a glance</li>
              <li><Check size={15} /> Revenue, spending and budget visibility</li>
              <li><Check size={15} /> Analytics and agent operations together</li>
            </ul>
            <a className="landing-text-link" href={dashboardHref}>Explore the dashboard <ArrowRight size={15} /></a>
          </div>
          <div className="landing-showcase-frame landing-reveal">
            <div className="landing-showcase-frame-bar">
              <span><i /><i /><i /></span>
              <b>Autonomous Finance</b>
              <span className="landing-showcase-live"><span /> APPLICATION</span>
            </div>
            <div className="landing-showcase-viewport">
              <iframe
                src="/dashboard?preview=1"
                title="Full Autonomous Finance product showcase"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="landing-section landing-how" id="how-it-works">
          <div className="landing-section-heading landing-reveal">
            <span className="landing-eyebrow">A SIMPLE, CONNECTED WORKFLOW</span>
            <h2>From Financial Data<br /><em>to Intelligent Decisions.</em></h2>
          </div>
          <div className="landing-steps">
            {steps.map(({ number, title, description, icon: Icon }, index) => (
              <article className="landing-step landing-reveal" key={number} style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="landing-step-icon"><Icon size={22} strokeWidth={1.6} /></div>
                <span className="landing-step-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                {index < steps.length - 1 && <span className="landing-step-connector" aria-hidden="true" />}
              </article>
            ))}
          </div>
        </section>

        <section className="landing-about" id="about">
          <div className="landing-about-orbit" aria-hidden="true"><span /><span /><span /></div>
          <div className="landing-about-content landing-reveal">
            <span className="landing-eyebrow">BUILT FOR FINANCIAL CLARITY</span>
            <h2>Smarter Financial<br /><em>Management Starts Here.</em></h2>
            <p>
              Autonomous Finance brings financial visibility, intelligent insights and workflow automation
              together in one platform. Designed to help businesses understand their finances and make
              confident decisions.
            </p>
            <div className="landing-about-signature"><ShieldCheck size={17} /> INTELLIGENT FINANCIAL MANAGEMENT</div>
          </div>
        </section>

        <section className="landing-cta landing-reveal">
          <div className="landing-cta-glow" aria-hidden="true" />
          <span className="landing-eyebrow">MOVE FORWARD WITH CONFIDENCE</span>
          <h2>Make Every Financial<br /><em>Decision Count.</em></h2>
          <p>Get a clearer view of your business finances and move forward with confidence.</p>
          <div className="landing-cta-actions">
            <a className="landing-button landing-button-primary" href={dashboardHref}>
              Get Started Today <ArrowRight size={16} />
            </a>
            <a className="landing-button landing-button-outline" href={dashboardHref}>Login</a>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-main">
          <a className="landing-brand" href="#home">
            <span className="landing-brand-mark"><Landmark size={19} strokeWidth={1.7} /></span>
            <span>Autonomous <strong>Finance</strong></span>
          </a>
          <p>Intelligent Financial Management.</p>
          <nav aria-label="Footer navigation">
            {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            <a href={dashboardHref}>Login</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms &amp; Conditions</a>
          </nav>
        </div>
        <div className="landing-footer-bottom">
          <span>© 2026 Autonomous Finance. All rights reserved.</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
