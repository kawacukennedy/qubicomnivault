
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';
import { Card } from '../components/ui/Card';

const Landing = () => {
  const navItems = [
    { label: 'Products', href: '/#products' },
    { label: 'How it works', href: '/#how' },
    { label: 'Docs', href: 'https://docs.qubic-omnivaul.example' },
    { label: 'Connect', href: '/connect' },
  ];

  const heroContent = {
    headline: 'Tokenize Real-World Collateral. Borrow, Lend, and Earn on Qubic.',
    subheadline: 'Mint oqAssets from invoices and assets, unlock liquidity, and route yields — all with deterministic execution on Qubic.',
    primaryCta: { label: 'Get Started', action: () => window.location.href = '/connect' },
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
        cta={{ label: 'Connect Wallet', action: () => window.location.href = '/connect' }}
      />

      <Hero {...heroContent} />

       {/* How it works */}
       <section id="how" className="py-20 px-4 bg-neutral-50">
         <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold mb-4">How It Works</h2>
             <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
               Transform traditional assets into digital tokens and unlock new financial possibilities.
             </p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="text-center">
               <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <span className="text-2xl font-bold text-primary-600">1</span>
               </div>
               <h3 className="text-xl font-semibold mb-4">Upload & Verify</h3>
               <p className="text-neutral-600">
                 Upload your invoices or assets. Our AI-powered verification system ensures authenticity and calculates fair valuations.
               </p>
             </div>
             <div className="text-center">
               <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <span className="text-2xl font-bold text-primary-600">2</span>
               </div>
               <h3 className="text-xl font-semibold mb-4">Mint oqAssets</h3>
               <p className="text-neutral-600">
                 Mint tokenized assets (oqAssets) backed by your collateral. These digital tokens represent real-world value on Qubic.
               </p>
             </div>
             <div className="text-center">
               <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <span className="text-2xl font-bold text-primary-600">3</span>
               </div>
               <h3 className="text-xl font-semibold mb-4">Borrow & Earn</h3>
               <p className="text-neutral-600">
                 Use oqAssets as collateral to borrow stablecoins or provide liquidity in pools to earn yields and participate in DeFi.
               </p>
             </div>
           </div>
         </div>
       </section>

       {/* Features Grid */}
       <section id="products" className="py-20 px-4">
         <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold mb-4">Key Features</h2>
             <p className="text-lg text-neutral-600">
               Everything you need to tokenize, borrow, and earn.
             </p>
           </div>
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