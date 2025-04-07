import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import { Company } from '@prisma/client';
import { useCompanyList } from '../../hooks';
import { renderStatus } from '../../../../helpers/renderStatus';
import { Card } from '@/components/ui';
import { renderIsDeletedToggle } from '../../../../helpers/renderActiveToggle';
import { CompanyWithUsers } from 'src/types/company';

const UserList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useCompanyList();

  const handlePaginationChange = (page: number) => {
    const newTableData = cloneDeep(tableData);
    newTableData.pageIndex = page;
    setTableData(newTableData);
  };

  const handleSelectChange = (value: number) => {
    const newTableData = cloneDeep(tableData);
    newTableData.pageSize = Number(value);
    newTableData.pageIndex = 1;
    setTableData(newTableData);
  };

  const handleSort = (sort: OnSortParam) => {
    const newTableData = cloneDeep(tableData);
    newTableData.sort = {
      [sort.key as string]: sort.order ? 'desc' : 'asc',
    };
    setTableData(newTableData);
  };

  const columns: ColumnDef<CompanyWithUsers>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre de la empresa',
        cell: (info) => (
          <>
            <div className="flex items-center gap-2">
              {info.row.original.logoUrl && (
                <img
                  src={info.row.original.logoUrl ?? ''}
                  alt="user"
                  className="w-8 h-8 rounded-full"
                />
              )}
              {info.row.original.logoUrl ? null : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                  {info.row.original.name?.[0]?.toUpperCase() ?? ''}
                </div>
              )}
              <span>{info.getValue() as string}</span>
            </div>
          </>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email del Usuario Principal',
        cell: (info) => info.row.original.recruiters[0]?.user?.email ?? 'Sin email registrado',
      },
      {
        accessorKey: 'membership',
        header: 'Tipo de membresía',
        cell: (info) => info.row.original.Membership[0]?.membership_type?.name ?? 'Bronce',
      },
      {
        accessorKey: 'isDeleted',
        header: 'Estado',
        cell: (info) =>
          renderIsDeletedToggle(info.getValue() as boolean, () => {}),
      },
      {
        accessorKey: 'created_at',
        header: 'Fecha de creación',
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString('es-GT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
      },
      {
        accessorKey: 'updated_at',
        header: 'Última actualización',
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString('es-GT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
      },
    ],
    []
  );

  return (
    <Card>
      <DataTable
        columns={columns}
        data={list}
        noData={!isLoading && list.length === 0}
        loading={isLoading}
        pagingData={{
          total: total,
          pageIndex: tableData.pageIndex as number,
          pageSize: tableData.pageSize as number,
        }}
        onPaginationChange={handlePaginationChange}
        onSelectChange={handleSelectChange}
        onSort={handleSort}
      />
    </Card>
  );
};

export default UserList;
