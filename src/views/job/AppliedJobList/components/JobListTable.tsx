import { useMemo } from 'react';
import Tag from '@/components/ui/Tag';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import useJobOfferList from '../hooks/useJobOfferList';
import cloneDeep from 'lodash/cloneDeep';
import { Link, useNavigate } from 'react-router-dom';
import { TbTrash, TbEdit, TbArchiveFilled, TbRefresh } from 'react-icons/tb';
import dayjs from 'dayjs';
import { NumericFormat } from 'react-number-format';
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable';
import type { JobOfferApplicant } from '../types';
import type { TableQueries } from '@/@types/common';
import { Switcher, toast } from '@/components/ui';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';
import { JobOffer } from '@prisma/client';




const JobListTable = ({ }: {

}) => {
  const {
    jobOfferList,
    jobOfferListTotal,
    tableData,
    isLoading,
    setTableData,
    mutate,
  } = useJobOfferList();


  const columns: ColumnDef<JobOfferApplicant>[] = useMemo(
    () => [
      {
        header: 'Título',
        accessorKey: 'name',
        cell: (props) => {
          const row = props.row.original.job;
          return <Link to={`/job/${row.uuid}`}><span className="font-semibold">{row.name}</span></Link>;
        },
      },
      {
        header: 'Puesto',
        accessorKey: 'job_hierarchy',
        cell: (props) => {
          const row = props.row.original.job; 
          return row.job_hierarchy.name;
        },
      },      
      {
        header: 'Empresa',
        accessorKey: 'companyId',
        cell: (props) => {
          const row = props.row.original.job;
          return row.company.name;
        },
      },
      {
        header: 'Fecha de Aplicación',
        accessorKey: 'applicationDate',
        cell: (props) => {
          const row = props.row.original;
          return (
            <span className="font-semibold">
              {dayjs(row.appliedAt).locale('es').format('DD/MM/YYYY')}
            </span>
          );
        },
      },
      {
        header: 'Revisado',
        accessorKey: 'reviewed',
        cell: (props) => {
          const {reviewed} = props.row.original;
          return <span className='font-semibold'>{ (reviewed) ? 'Sí' : 'No'}</span>
          },
      },

    ],
    []
  );

  const handleSetTableData = (data: TableQueries) => {
    setTableData(data);
  };

  const handlePaginationChange = (page: number) => {
    const newTableData = cloneDeep(tableData);
    newTableData.pageIndex = page;
    handleSetTableData(newTableData);
  };

  const handleSelectChange = (value: number) => {
    const newTableData = cloneDeep(tableData);
    newTableData.pageSize = Number(value);
    newTableData.pageIndex = 1;
    handleSetTableData(newTableData);
  };

  const handleSort = (sort: OnSortParam) => {
    const newTableData = cloneDeep(tableData);
    newTableData.sort = {
      [sort.key as string]: sort.order ? 'desc' : 'asc',
    };
    handleSetTableData(newTableData);
  };

  return (
    <DataTable
      columns={columns}
      data={jobOfferList}
      noData={!isLoading && jobOfferList.length === 0}
      skeletonAvatarColumns={[0]}
      skeletonAvatarProps={{ width: 28, height: 28 }}
      loading={isLoading}
      pagingData={{
        total: jobOfferListTotal,
        pageIndex: tableData.pageIndex as number,
        pageSize: tableData.pageSize as number,
      }}
      onPaginationChange={handlePaginationChange}
      onSelectChange={handleSelectChange}
      onSort={handleSort}
    />
  );
};

export default JobListTable;
