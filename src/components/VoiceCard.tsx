import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Download, Star } from 'lucide-react';
import WaveAnimation from './WaveAnimation';

interface VoiceCardProps {
  name: string;
  type: string;
  description: string;
  avatar: string;
  quote: string;
  image: string;
  personality: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onPreview?: () => void;
  onDownload?: () => void;
}

const VoiceCard = ({
  name,
  type,
  description,
  avatar,
  quote,
  image,
  personality,
  isSelected = false,
  onSelect,
  onPreview,
  onDownload
}: VoiceCardProps) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload();
    } else {
      console.log("Download not available for this voice");
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${isSelected
        ? 'border-primary bg-primary/10 shadow-purple ring-2 ring-primary/20'
        : 'border-border/20 bg-card/50 hover:border-primary/50 hover:shadow-purple'
        }`}
      onClick={onSelect}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />

      <div className="p-6 relative z-10">
        <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
            >
              <Star className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </div>

        <div className="text-center space-y-3">
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="font-bold text-lg">👄 {name}</h3>
              <Badge variant="outline" className="text-xs">{type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">🎭 {personality}</p>
          </div>

          <div className="min-h-[3rem] flex items-center justify-center">
            <p className="text-sm italic text-muted-foreground text-center">"{quote}"</p>
          </div>

          <div className="flex items-center justify-center mb-4">
            <WaveAnimation isActive={isSelected} />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onPreview?.();
              }}
            >
              <Play className="h-3 w-3 mr-1" />
              🔊 Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceCard;
