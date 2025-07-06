import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
	{
		name: "Sarah Chen",
		role: "Content Creator",
		text: "Seducely.AI transformed how I connect with my audience. The voices are incredibly realistic!",
		rating: 5,
	},
	{
		name: "Marcus Rodriguez",
		role: "Podcaster",
		text: "I've tried many AI voice tools, but nothing comes close to Seducely.AI's quality.",
		rating: 5,
	},
	{
		name: "Emma Thompson",
		role: "Marketing Director",
		text: "Our engagement rates doubled after using Seducely.AI for our campaigns.",
		rating: 5,
	},
];

const TestimonialCarousel = () => {
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrent((prev) => (prev + 1) % testimonials.length);
		}, 4000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className="relative h-24 overflow-hidden">
			<AnimatePresence mode="wait">
				<motion.div
					key={current}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.5 }}
					className="absolute inset-0 flex flex-col items-center text-center"
				>
					<div className="flex mb-2">
						{[...Array(testimonials[current].rating)].map((_, i) => (
							<Star
								key={i}
								className="w-4 h-4 fill-yellow-400 text-yellow-400"
							/>
						))}
					</div>
					<p className="text-sm text-muted-foreground mb-2 max-w-md">
						"{testimonials[current].text}"
					</p>
					<p className="text-xs font-medium">
						{testimonials[current].name}, {testimonials[current].role}
					</p>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default TestimonialCarousel;
