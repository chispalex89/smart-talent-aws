import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import { User } from '@prisma/client';
import { useUserList } from '../../hooks';
import { nameFormat } from '../../../../helpers/textConverter';
import { renderStatus } from '../../../../helpers/renderStatus';
import { profileImageUrl } from '../../../../helpers/s3Url';
import { Card } from '@/components/ui';

const UserList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useUserList();

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

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: (info) => (
          <>
            <div className="flex items-center gap-2">
              {info.row.original.profileImage && (
                <img
                  src={profileImageUrl(info.row.original.profileImage) ?? ''}
                  alt="user"
                  className="w-8 h-8 rounded-full"
                />
              )}
              {info.row.original.profileImage ? null : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                  {info.row.original.firstName?.[0]?.toUpperCase() ?? ''}
                  {info.row.original.lastName?.[0]?.toUpperCase() ?? ''}
                </div>
              )}
              <span>{nameFormat(info.row.original)}</span>
            </div>
          </>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: (info) => renderStatus(info.getValue() as string),
      },
      {
        accessorKey: 'role',
        header: 'Rol',
        cell: (info) => info.getValue(),
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
