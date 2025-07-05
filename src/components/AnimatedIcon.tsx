
import { motion } from 'framer-react';
import { useInView } from 'react-intersection-observer';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  delay?: number;
  className?: string;
}

const AnimatedIcon = ({ icon: Icon, delay = 0, className = "" }: AnimatedIconProps) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, rotate: -180 }}
      animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 200,
        damping: 10
      }}
      className={className}
    >
      <Icon className="w-8 h-8 text-primary" />
    </motion.div>
  );
};

export default AnimatedIcon;
