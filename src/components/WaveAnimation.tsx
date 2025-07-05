
import { motion } from 'framer-motion';

const WaveAnimation = ({ isActive = false }: { isActive?: boolean }) => {
  return (
    <div className="flex items-center justify-center space-x-1 h-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary rounded-full"
          animate={isActive ? {
            height: [8, 24, 8],
            opacity: [0.3, 1, 0.3]
          } : {
            height: 8,
            opacity: 0.3
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default WaveAnimation;
