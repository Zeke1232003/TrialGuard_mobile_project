// Molecule: Text Parser Component
import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Wand2, Copy } from 'lucide-react';
import { sampleTexts } from '../../utils/parser';
import { toast } from 'sonner';

interface TextParserProps {
  onParse: (text: string) => void;
}

export function TextParser({ onParse }: TextParserProps) {
  const [pastedText, setPastedText] = useState('');

  const handleParse = () => {
    if (!pastedText.trim()) {
      toast.error('Please paste some text first');
      return;
    }
    onParse(pastedText);
  };

  const copySampleText = (text: string) => {
    setPastedText(text);
    toast.success('Sample text loaded!');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pastedText">Paste Email or SMS Receipt</Label>
        <Textarea
          id="pastedText"
          placeholder="Paste your email or SMS receipt here..."
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      <Button 
        onClick={handleParse} 
        className="w-full bg-teal-500 hover:bg-teal-600"
      >
        <Wand2 className="w-4 h-4 mr-2" />
        Analyze
      </Button>

      {/* Sample Texts */}
      <div className="pt-4 border-t">
        <p className="text-sm font-medium text-gray-700 mb-3">Try sample receipts:</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copySampleText(sampleTexts.netflix)}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Netflix
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copySampleText(sampleTexts.spotify)}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Spotify
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copySampleText(sampleTexts.trial)}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Trial
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copySampleText(sampleTexts.thai)}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Thai
          </Button>
        </div>
      </div>
    </div>
  );
}
