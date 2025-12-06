
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Settings = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-8">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Email alerts</label>
                <input type="checkbox" className="rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Telegram</label>
                <Input placeholder="Telegram handle or chat ID" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">EasyConnect Templates</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-medium">
                    <span>Liquidation Alert</span>
                    <Button size="sm">Configure</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="mb-4">Create New API Key</Button>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-medium">
                  <span>Key: ****-****-****-abcd</span>
                  <Button size="sm" variant="outline">Revoke</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;