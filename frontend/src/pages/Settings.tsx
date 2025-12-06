
import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('notifications');

  const sections = [
    { id: 'notifications', label: 'Notifications' },
    { id: 'api-keys', label: 'API Keys' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeSection === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
                <form className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Email alerts</label>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Telegram
                    </label>
                    <Input placeholder="Telegram handle or chat ID" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      EasyConnect Templates
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-medium">
                        <div>
                          <p className="font-medium">Liquidation Alert</p>
                          <p className="text-sm text-neutral-600">
                            Notify when position LTV exceeds threshold
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-medium">
                        <div>
                          <p className="font-medium">Interest Accrued</p>
                          <p className="text-sm text-neutral-600">
                            Daily summary of interest earned
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </Card>
            )}

            {activeSection === 'api-keys' && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">API Keys</h2>
                <Button className="mb-6">Create New API Key</Button>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-medium">
                    <div>
                      <p className="font-medium">Key: ****-****-****-abcd</p>
                      <p className="text-sm text-neutral-600">
                        Created: Jan 15, 2024
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Revoke
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-medium">
                    <div>
                      <p className="font-medium">Key: ****-****-****-efgh</p>
                      <p className="text-sm text-neutral-600">
                        Created: Dec 20, 2023
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Revoke
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;