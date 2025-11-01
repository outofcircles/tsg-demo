
import React, { useState } from 'react';
import { generateEventIdeas } from '../services/geminiService';
import { Card, CardHeader, CardContent, CardTitle, Input, Button } from './UI';
import { BotIcon } from '../constants';

const EventIdeaGenerator: React.FC = () => {
  const [theme, setTheme] = useState<string>('');
  const [ideas, setIdeas] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError('Please enter an event theme.');
      return;
    }
    setError('');
    setIsLoading(true);
    setIdeas('');
    const result = await generateEventIdeas(theme);
    if (result.startsWith('Error:')) {
        setError(result);
    } else {
        setIdeas(result);
    }
    setIsLoading(false);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
            <BotIcon className="h-6 w-6 text-primary-600"/>
            <CardTitle>AI Event Idea Generator</CardTitle>
        </div>
        <p className="text-sm text-gray-500 mt-1">Stuck for ideas? Let our AI assistant help you out!</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
              Event Theme (e.g., "Vintage Circus", "Tropical Luau")
            </label>
            <Input
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Enter a theme for your event"
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Ideas'}
          </Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {isLoading && (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="ml-2 text-gray-600">Thinking...</p>
            </div>
          )}
          {ideas && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800">Here are a few ideas:</h4>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-gray-600 text-sm">{ideas}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventIdeaGenerator;
