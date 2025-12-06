
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';
import { Card } from '../components/ui/Card';

const Landing = () => {
  const navItems = [
    { label: 'Products', href: '/#products' },
    { label: 'How it works', href: '/#how' },
    { label: 'Docs', href: 'https://docs.qubic-omnivaul.example' },
    { label: 'Dashboard', href: '/app' },
  ];

  const heroContent = {
    headline: 'Tokenize Real-World Collateral. Borrow, Lend, and Earn on Qubic.',
    subheadline: 'Mint oqAssets from invoices and assets, unlock liquidity, and route yields — all with deterministic execution on Qubic.',
    primaryCta: { label: 'Get Started', action: () => window.location.href = '/app' },
    secondaryCta: { label: 'Watch Demo', action: () => alert('Demo video') },
    visual: { src: '/hero-illustration.svg', alt: 'Diagram of tokenized invoices and liquidity flows' },
  };

  const features = [
    { title: 'Invoice Tokenization', desc: 'Issue oqAssets backed by verified invoices with immutable proofs.' },
    { title: 'On-Chain Borrowing', desc: 'Use oqAssets as collateral to borrow stable liquidity on Qubic.' },
    { title: 'Automated Risk Alerts', desc: 'EasyConnect templates notify your community on price moves.' },
  ];

  const footerLinks = ['Docs', 'Terms', 'Privacy', 'Contact'];
  const social = ['discord', 'twitter'];

  return (
    <div className="min-h-screen">
      <Navbar
        logo="Qubic OmniVault"
        navItems={navItems}
        cta={{ label: 'Connect Wallet', action: () => alert('Connect wallet') }}
      />

      <Hero {...heroContent} />

      {/* Features Grid */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-neutral-600">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer
        links={footerLinks}
        social={social}
        copyright="© Qubic OmniVault 2025"
      />
    </div>
  );
};

export default Landing;