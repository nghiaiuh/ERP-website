'use client';

import { useQuery } from "@tanstack/react-query";
import { Alert, Card, Flex, Space, Spin, Tag, Typography } from "antd";
import { useTranslations } from "next-intl";

import { Button } from '@/components/ui/button';
import { fetchHealth } from "@/lib/api/health";

const { Text } = Typography;

export function HealthStatus() {
    const t = useTranslations('Workspace');

    const health = useQuery({
        queryKey: ['backend-health'],
        queryFn: fetchHealth,
        retry: false
    });

    return (
        <Card>
            <Flex align="center" justify="space-between" gap={16} wrap>
                <Space size="middle">
                    <Text strong>{t('backendLabel')}</Text>
                    {health.isPending && <Spin size="small" />}
                    {health.isSuccess && (
                        <Tag color="success">
                            {t('backendOnline')}
                        </Tag>
                    )}
                    {health.isError && (
                        <Tag color="error">
                            {t('backendOffline')}
                        </Tag>
                    )}
                </Space>

                <Button
                    onClick={() => void health.refetch()}
                    loading={health.isFetching}
                >
                    {t('checkApi')}
                </Button>
            </Flex>

            {health.isError && (
                <Alert
                    className="mt-4"
                    type="warning"
                    showIcon
                    title={t('healthErrorMessage')}
                    description={t('healthErrorDescription')}
                />
            )}
        </Card>
    )
}
