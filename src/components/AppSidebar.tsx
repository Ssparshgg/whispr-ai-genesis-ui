import { BarChart3, Mic, Copy } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

const items = [
	{ title: "Dashboard", url: "/dashboard", icon: BarChart3 },
	{ title: "Text to Speech", url: "/generate-voice", icon: Mic },
	{ title: "Clone Voice", url: "/clone", icon: Copy },
];

export function AppSidebar() {
	const { state } = useSidebar();
	const location = useLocation();
	const currentPath = location.pathname;

	const isActive = (path: string) => currentPath === path;

	return (
		<Sidebar
			className="border-r border-border/20 bg-background/95 backdrop-blur-sm pt-0 top-16"
			collapsible="offcanvas"
		>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="text-primary font-semibold text-lg mb-4"></SidebarGroupLabel>
					<SidebarGroupContent>
						<div className="flex flex-col gap-4 mt-2">
							{items.map((item) => {
								const active = isActive(item.url);
								return (
									<NavLink
										key={item.title}
										to={item.url}
										end
										className={({ isActive }) =>
											`flex items-center gap-4 px-5 py-4 rounded-xl shadow-sm transition-all text-lg font-semibold border
                      ${
												isActive || active
													? "bg-primary/10 border-primary text-primary"
													: "bg-muted border-transparent text-muted-foreground hover:bg-primary/5 hover:text-foreground"
											}`
										}
									>
										<item.icon className="h-6 w-6" />
										<span className="">{item.title}</span>
									</NavLink>
								);
							})}
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
