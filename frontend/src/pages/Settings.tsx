
import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import {
  useUserPreferences,
  useUpdatePreferences,
  useEasyConnectTemplates,
  useCreateEasyConnectTemplate,
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey
} from '../services/api';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('notifications');
  const [easyConnectModal, setEasyConnectModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    template_name: '',
    event_type: '',
    destination: '',
    payload_mapping: {}
  });
  const [newApiKeyName, setNewApiKeyName] = useState('');

  const { data: preferences } = useUserPreferences();
  const updatePreferencesMutation = useUpdatePreferences();
  const { data: templates } = useEasyConnectTemplates();
  const createTemplateMutation = useCreateEasyConnectTemplate();
  const { data: apiKeys } = useApiKeys();
  const createApiKeyMutation = useCreateApiKey();
  const revokeApiKeyMutation = useRevokeApiKey();

  const sections = [
    { id: 'notifications', label: 'Notifications' },
    { id: 'api-keys', label: 'API Keys' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1 order-2 lg:order-1">
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
          <div className="lg:col-span-3 order-1 lg:order-2">
            {activeSection === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
                <form
                  className="space-y-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const updatedPreferences = {
                      email_alerts: formData.get('email_alerts') === 'on',
                      telegram_handle: formData.get('telegram') as string,
                    };
                    try {
                      await updatePreferencesMutation.mutateAsync(updatedPreferences);
                      alert('Preferences updated successfully');
                    } catch (error) {
                      console.error('Update failed:', error);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Email alerts</label>
                    <input
                      type="checkbox"
                      name="email_alerts"
                      defaultChecked={preferences?.email_alerts}
                      className="rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Telegram
                    </label>
                    <Input
                      name="telegram"
                      placeholder="Telegram handle or chat ID"
                      defaultValue={preferences?.telegram_handle || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      EasyConnect Templates
                    </label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="mb-3"
                      onClick={() => setEasyConnectModal(true)}
                    >
                      Create New Template
                    </Button>
                    <div className="space-y-3">
                      {templates?.map((template: any) => (
                        <div key={template.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-medium">
                          <div>
                            <p className="font-medium">{template.template_name}</p>
                            <p className="text-sm text-neutral-600">
                              Event: {template.event_type} → {template.destination}
                            </p>
                          </div>
                          <Badge variant="success">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" disabled={updatePreferencesMutation.isPending}>
                    {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Card>
            )}

            {activeSection === 'api-keys' && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">API Keys</h2>
                <div className="flex items-center gap-4 mb-6">
                  <Input
                    placeholder="API Key name"
                    value={newApiKeyName}
                    onChange={(e) => setNewApiKeyName(e.target.value)}
                  />
                  <Button
                    onClick={async () => {
                      if (!newApiKeyName) return;
                      try {
                        await createApiKeyMutation.mutateAsync({ name: newApiKeyName });
                        setNewApiKeyName('');
                        // Refetch
                        window.location.reload();
                      } catch (error) {
                        console.error('Create API key failed:', error);
                      }
                    }}
                    disabled={createApiKeyMutation.isPending}
                  >
                    {createApiKeyMutation.isPending ? 'Creating...' : 'Create New API Key'}
                  </Button>
                </div>
                <div className="space-y-3">
                  {apiKeys?.map((key: any) => (
                    <div key={key.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-medium">
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <p className="text-sm text-neutral-600">
                          Created: {new Date(key.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await revokeApiKeyMutation.mutateAsync(key.id);
                            // Refetch
                            window.location.reload();
                          } catch (error) {
                            console.error('Revoke API key failed:', error);
                          }
                        }}
                        disabled={revokeApiKeyMutation.isPending}
                      >
                        Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={easyConnectModal}
        onClose={() => setEasyConnectModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Create EasyConnect Template</ModalTitle>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Template Name</label>
              <Input
                placeholder="e.g., Liquidation Alert"
                value={newTemplate.template_name}
                onChange={(e) => setNewTemplate({ ...newTemplate, template_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Event Type</label>
              <select
                className="w-full px-3 py-2 border border-neutral-200 rounded-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={newTemplate.event_type}
                onChange={(e) => setNewTemplate({ ...newTemplate, event_type: e.target.value })}
              >
                <option value="">Select event type</option>
                <option value="liquidation">Liquidation</option>
                <option value="interest_accrued">Interest Accrued</option>
                <option value="position_created">Position Created</option>
                <option value="loan_repaid">Loan Repaid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Destination</label>
              <Input
                placeholder="e.g., Discord webhook URL or Telegram chat ID"
                value={newTemplate.destination}
                onChange={(e) => setNewTemplate({ ...newTemplate, destination: e.target.value })}
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setEasyConnectModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await createTemplateMutation.mutateAsync(newTemplate);
                setEasyConnectModal(false);
                setNewTemplate({
                  template_name: '',
                  event_type: '',
                  destination: '',
                  payload_mapping: {}
                });
                // Refetch
                window.location.reload();
              } catch (error) {
                console.error('Create template failed:', error);
              }
            }}
            disabled={createTemplateMutation.isPending || !newTemplate.template_name || !newTemplate.event_type || !newTemplate.destination}
          >
            {createTemplateMutation.isPending ? 'Creating...' : 'Create Template'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Settings;