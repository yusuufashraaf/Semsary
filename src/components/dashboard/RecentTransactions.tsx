/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardHeader, CardBody } from "@components/ui/Card"; 
import { Badge } from "@components/ui/Badge";
import { Table } from "@components/ui/Table";
import { EmptyState } from "@components/ui/EmptyState";
import { formatCurrency, formatDate } from "@utils/formatters";
import { getStatusText } from "@utils/statusHelpers";
import { Transaction } from "@app-types/admin/admin";
import { CreditCardIcon } from "@heroicons/react/24/outline";

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  loading = false,
  onTransactionClick,
}) => {
  const columns = [
    {
      key: "id",
      label: "ID",
      render: (value: number) => `#${value}`,
      width: "80px",
    },
    {
      key: "user",
      label: "User",
      render: (user: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      ),
    },
    {
      key: "property",
      label: "Property",
      render: (property: any) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {property.title}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {property.location.city}, {property.location.state}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: string) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {formatCurrency(value)}
        </span>
      ),
      align: "right" as const,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge status={value}>{getStatusText(value)}</Badge>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (value: string) => formatDate(value),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Transactions
        </h3>
      </CardHeader>
      <CardBody className="p-0">
        {transactions.length === 0 && !loading ? (
          <EmptyState
            icon={<CreditCardIcon className="h-12 w-12" />}
            title="No transactions yet"
            description="Transactions will appear here once users start making payments."
          />
        ) : (
          <Table
            data={transactions}
            columns={columns}
            loading={loading}
            onRowClick={onTransactionClick}
          />
        )}
      </CardBody>
    </Card>
  );
};
