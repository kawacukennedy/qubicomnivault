import React from 'react';

interface FooterProps {
  links: string[];
  social: string[];
  copyright: string;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({
  links,
  social,
  copyright,
  className,
}) => {
  return (
    <footer className={`bg-neutral-900 text-white py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo/Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="font-bold text-xl mb-4">Qubic OmniVault</div>
            <p className="text-neutral-400 text-sm">
              Tokenize Real-World Collateral. Borrow, Lend, and Earn on Qubic.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {social.map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
          <p className="text-neutral-400 text-sm">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };