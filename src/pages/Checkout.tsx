import React from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const ProductDisplay = () => (
	<section>
		<div className="product">
			<img
				src="/lovable-uploads/14409e85-31c6-4734-9111-93f71150b711.png"
				alt="Linh"
			/>
			<div className="description">
				<h3>Stubborn Attachments</h3>
				<h5>$20.00</h5>
			</div>
		</div>
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				const data = await api.createCheckoutSession({});
				if (data.url) {
					window.location = data.url;
				}
			}}
		>
			<button type="submit">Checkout</button>
		</form>
	</section>
);

const Message = ({ message }) => (
	<section>
		<p>{message}</p>
	</section>
);

export default function CheckoutPage() {
	const [message, setMessage] = React.useState("");
	const { toast } = useToast();

	React.useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		if (query.get("success")) {
			setMessage("Order placed! You will receive an email confirmation.");
			toast({
				title: "Payment Successful!",
				description:
					"Your credits have been added. Thank you for your purchase!",
				variant: "default",
			});
		}
		if (query.get("canceled")) {
			setMessage(
				"Order canceled -- continue to shop around and checkout when you're ready."
			);
			toast({
				title: "Payment Canceled",
				description:
					"You have not been charged. Please try again if you wish to purchase credits.",
				variant: "destructive",
			});
		}
	}, [toast]);

	return message ? <Message message={message} /> : <ProductDisplay />;
}
