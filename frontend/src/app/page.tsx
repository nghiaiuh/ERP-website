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
import { fetchHealth } from '@/lib/api/health';
import { useLayoutStore } from '@/stores/layout.store';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const services = [
  { name: 'MongoDB', detail: 'Business source of truth', icon: <DatabaseOutlined /> },
  { name: 'Redis', detail: 'Cache and ephemeral state', icon: <CloudServerOutlined /> },
  { name: 'RabbitMQ', detail: 'Asynchronous workflows', icon: <ApiOutlined /> },
  { name: 'MinIO', detail: 'Document object storage', icon: <CloudServerOutlined /> },
];

export default function HomePage() {
  const collapsed = useLayoutStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const health = useQuery({
    queryKey: ['backend-health'],
    queryFn: fetchHealth,
    retry: false,
  });

  return (
    <Layout className="app-shell">
      <Sider width={240} collapsed={collapsed} className="sidebar">
        <div className="brand">{collapsed ? 'ERP' : 'ERP Workspace'}</div>
        <div className="navigation-item">
          <DatabaseOutlined />
          {!collapsed && <span>Tổng quan hệ thống</span>}
        </div>
      </Sider>
      <Layout>
        <Header className="topbar">
          <Button
            type="text"
            aria-label="Thu gọn thanh điều hướng"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
          />
          <Text strong>ERP Platform</Text>
        </Header>
        <Content className="content">
          <Flex justify="space-between" align="center" gap={16} wrap>
            <div>
              <Title level={2}>Nền tảng đã sẵn sàng để phát triển</Title>
              <Text type="secondary">
                Next.js frontend kết nối NestJS API qua một lớp client có kiểu dữ liệu rõ ràng.
              </Text>
            </div>
            <Button onClick={() => void health.refetch()}>Kiểm tra lại API</Button>
          </Flex>

          <Card className="status-card">
            <Space size="middle">
              <Text strong>Backend</Text>
              {health.isPending && <Spin size="small" />}
              {health.isSuccess && <Tag color="success">Online · cổng 3000</Tag>}
              {health.isError && <Tag color="error">Offline</Tag>}
            </Space>
            {health.isError && (
              <Alert
                className="health-alert"
                type="warning"
                showIcon
                message="Không kết nối được backend"
                description="Hãy chạy corepack yarn docker:up, sau đó corepack yarn dev."
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
