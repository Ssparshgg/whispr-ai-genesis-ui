import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
	{
		name: "Vietbunny",
		role: "Content Creator",
		text: "Seducely AI has made every night more pleasurable for me, and I feel it's the best companion.",
		rating: 5,
		image: "/vietbunny.jpg",
	},
	{
		name: "Bonnieblue",
		role: "Podcaster",
		text: "I've tried many AI voice tools, but nothing comes close to Seducely AI's quality.",
		rating: 5,
		image: "/bonnieblue.jpg",
	},
	{
		name: "Saurezlong",
		role: "Marketing Director",
		text: "Seducely AI has been a game changer in my life it helped me relieve stress and brought immense pleasure to my ears.",
		rating: 5,
		image: "/saurezlong.jpg",
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
		<div className="relative h-40 overflow-hidden flex flex-col items-center justify-center">
			<AnimatePresence mode="wait">
				<motion.div
					key={current}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.5 }}
					className="absolute inset-0 flex flex-col items-center text-center justify-center"
				>
					<div className="flex mb-2">
						{[...Array(testimonials[current].rating)].map((_, i) => (
							<Star
								key={i}
								className="w-4 h-4 fill-yellow-400 text-yellow-400"
							/>
						))}
					</div>
					<img
						src={testimonials[current].image}
						alt={testimonials[current].name}
						className="w-12 h-12 rounded-full object-cover border-2 border-primary/30 mb-2"
					/>
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
