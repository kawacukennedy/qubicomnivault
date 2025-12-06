import React from 'react';
import { Button } from '../components/ui/Button';
import WalletButton from '../components/WalletButton';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-neutral-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl">Qubic OmniVault</div>
            <nav className="hidden md:flex space-x-8">
              <a href="#products" className="text-neutral-600 hover:text-primary-600">Products</a>
              <a href="#how" className="text-neutral-600 hover:text-primary-600">How it works</a>
              <a href="https://docs.qubic-omnivaul.example" className="text-neutral-600 hover:text-primary-600">Docs</a>
              <a href="/app" className="text-neutral-600 hover:text-primary-600">Dashboard</a>
            </nav>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                Tokenize Real-World Collateral. Borrow, Lend, and Earn on Qubic.
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                Mint oqAssets from invoices and assets, unlock liquidity, and route yields — all with deterministic execution on Qubic.
              </p>
              <div className="flex space-x-4">
                <Button size="lg">Get Started</Button>
                <Button variant="outline" size="lg">Watch Demo</Button>
              </div>
            </div>
            <div className="bg-white rounded-large p-8 shadow-large">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4">Hero Illustration Placeholder</h3>
                <p>Diagram of tokenized invoices and liquidity flows</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Invoice Tokenization</h3>
              <p className="text-neutral-600">Issue oqAssets backed by verified invoices with immutable proofs.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">On-Chain Borrowing</h3>
              <p className="text-neutral-600">Use oqAssets as collateral to borrow stable liquidity on Qubic.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Automated Risk Alerts</h3>
              <p className="text-neutral-600">EasyConnect templates notify your community on price moves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Qubic OmniVault</h4>
              <p className="text-sm text-neutral-400">© 2025 Qubic OmniVault</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-400 hover:text-white">Docs</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;