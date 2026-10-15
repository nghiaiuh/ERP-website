'use client';

import {
  ApiOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Card, Col, Flex, Layout, Row, Space, Spin, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { fetchHealth } from '@/lib/api/health';
import { useLayoutStore } from '@/stores/layout.store';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function HomePage() {
  const t = useTranslations('Workspace');
  const collapsed = useLayoutStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const health = useQuery({
    queryKey: ['backend-health'],
    queryFn: fetchHealth,
    retry: false,
  });
  const services = [
    {
      name: t('services.mongodb.name'),
      detail: t('services.mongodb.detail'),
      icon: <DatabaseOutlined />,
    },
    {
      name: t('services.redis.name'),
      detail: t('services.redis.detail'),
      icon: <CloudServerOutlined />,
    },
    {
      name: t('services.rabbitmq.name'),
      detail: t('services.rabbitmq.detail'),
      icon: <ApiOutlined />,
    },
    {
      name: t('services.minio.name'),
      detail: t('services.minio.detail'),
      icon: <CloudServerOutlined />,
    },
  ];

  return (
    <Layout className="app-shell">
      <Sider width={240} collapsed={collapsed} className="sidebar">
        <div className="brand">
          {collapsed ? t('brandShort') : t('brand')}
        </div>
        <div className="navigation-item">
          <DatabaseOutlined />
          {!collapsed && <span>{t('overview')}</span>}
        </div>
      </Sider>
      <Layout>
        <Header className="topbar">
          <Button
            type="text"
            aria-label={t('toggleNavigation')}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
          />
          <Text strong>{t('platformName')}</Text>
        </Header>
        <Content className="content">
          <Flex justify="space-between" align="center" gap={16} wrap>
            <div>
              <Title level={2}>{t('readyTitle')}</Title>
              <Text type="secondary">
                {t('readyDescription')}
              </Text>
            </div>
            <Button onClick={() => void health.refetch()}>
              {t('checkApi')}
            </Button>
          </Flex>

          <Card className="status-card">
            <Space size="middle">
              <Text strong>{t('backendLabel')}</Text>
              {health.isPending && <Spin size="small" />}
              {health.isSuccess && (
                <Tag color="success">{t('backendOnline')}</Tag>
              )}
              {health.isError && (
                <Tag color="error">{t('backendOffline')}</Tag>
              )}
            </Space>
            {health.isError && (
              <Alert
                className="health-alert"
                type="warning"
                showIcon
                title={t('healthErrorMessage')}
                description={t('healthErrorDescription')}
              />
            )}
          </Card>

          <Row gutter={[16, 16]}>
            {services.map((service) => (
              <Col xs={24} sm={12} xl={6} key={service.name}>
                <Card className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <Title level={4}>{service.name}</Title>
                  <Text type="secondary">{service.detail}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
