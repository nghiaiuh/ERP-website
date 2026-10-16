'use client';

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from 'antd';
import { IconButton } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { useLayoutStore } from "@/stores/layout.store";

const { Header, Sider, Content } = Layout;

interface WorkspaceShellProps {
    children: ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
    const t = useTranslations('Workspace');
    const collapsed = useLayoutStore(
        (state) => state.sidebarCollapsed,
    );
    const toggleSidebar = useLayoutStore(
        (state) => state.toggleSidebar,
    );

    return (
        <Layout className="min-h-screen">
            <Sider width={240} collapsed={collapsed}>
                <div className="p-4 font-bold text-white">
                    {collapsed ? t('brandShort') : t('brand')}
                </div>
                <div className="mx-2 rounded-md px-3 py-2 text-white/80">
                    {!collapsed && t('overview')}
                </div>
            </Sider>
            <Layout>
                <Header className="flex items-center gap-4 bg-surface px-4">
                    <IconButton
                        intent="ghost"
                        label={t('toggleNavigation')}
                        icon={
                            collapsed
                            ? <MenuUnfoldOutlined />
                            : <MenuFoldOutlined />
                        }
                        onClick={toggleSidebar}
                    />
                    <span className="font-semibold text-foreground">
                        {t('platformName')}
                    </span>
                </Header>
                <Content className="bg-page p-6">
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}
