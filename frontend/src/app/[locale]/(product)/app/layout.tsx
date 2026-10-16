import { WorkspaceShell } from "@/features/workspace/components/workspace-shell";
import { QueryProvider } from "@/providers/query-provider";

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({
    children,
}: AppLayoutProps) {
    return (
        <QueryProvider>
            <WorkspaceShell>
                {children}
            </WorkspaceShell>
        </QueryProvider>
    )
}