
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Download } from 'lucide-react';
import WaveAnimation from './WaveAnimation';

interface VoiceCardProps {
  name: string;
  type: string;
  description: string;
  avatar: string;
  quote: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onPreview?: () => void;
}

const VoiceCard = ({ 
  name, 
  type, 
  description, 
  avatar, 
  quote, 
  isSelected = false, 
  onSelect,
  onPreview 
}: VoiceCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-primary bg-primary/10 shadow-purple' 
          : 'border-border/20 bg-card/50 hover:border-primary/50'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
          isSelected ? 'bg-primary text-white' : 'bg-primary/20 text-primary'
        }`}>
          {avatar}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{name}</h3>
            <Badge variant="outline" className="text-xs">{type}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm italic text-muted-foreground">"{quote}"</p>
      </div>
      
      <div className="flex items-center justify-between">
        <WaveAnimation isActive={isSelected} />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.();
            }}
          >
            <Play className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceCard;
