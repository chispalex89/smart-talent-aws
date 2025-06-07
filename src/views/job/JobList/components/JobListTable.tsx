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
import type { Job } from '../types';
import type { TableQueries } from '@/@types/common';
import { Switcher, toast } from '@/components/ui';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';
import { JobOffer } from '@prisma/client';

const jobOfferStatusColor: Record<
  string,
  {
    label: string;
    bgClass: string;
    textClass: string;
  }
> = {
  active: {
    label: 'Activo',
    bgClass: 'bg-success-subtle',
    textClass: 'text-success',
  },
  inactive: {
    label: 'Inactivo',
    bgClass: 'bg-warning-subtle',
    textClass: 'text-warning',
  },
  archived: {
    label: 'Archivado',
    bgClass: 'bg-error-subtle',
    textClass: 'text-error',
  },
};

const ActionColumn = ({
  row,
  handleDelete,
  handleArchive,
  handleRepublish,
}: {
  row: Job;
  handleDelete: (uuid: string) => void;
  handleArchive: (uuid: string) => void;
  handleRepublish: (uuid: string) => void;
}) => {
  const navigate = useNavigate();

  const onEdit = () => {
    navigate(`/job/edit/${row.uuid}`);
  };

  return (
    <div className="flex justify-end text-lg gap-1">
      <Tooltip wrapperClass="flex" title="Republicar">
        <span
          className="cursor-pointer p-2"
          onClick={() => handleRepublish(row.uuid)}
        >
          <TbRefresh color="#0CAF60" />
        </span>
      </Tooltip>
      <Tooltip wrapperClass="flex" title="Archivar">
        <span
          className="cursor-pointer p-2"
          onClick={() => handleArchive(row.uuid)}
        >
          <TbArchiveFilled color="#FFD027" />
        </span>
      </Tooltip>
      <Tooltip wrapperClass="flex" title="Editar">
        <span className={`cursor-pointer p-2`} onClick={onEdit}>
          <TbEdit color="#3D4490" />
        </span>
      </Tooltip>
      <Tooltip wrapperClass="flex" title="Eliminar">
        <span
          className="cursor-pointer p-2 hover:text-red-500"
          onClick={() => handleDelete(row.uuid)}
        >
          <TbTrash color="red" />
        </span>
      </Tooltip>
    </div>
  );
};

const JobListTable = ({
  handleDelete,
  handleArchive,
  handleRepublish,
}: {
  handleDelete: (uuid: string) => void;
  handleArchive: (uuid: string) => void;
  handleRepublish: (uuid: string) => void;
}) => {
  const {
    jobOfferList,
    jobOfferListTotal,
    tableData,
    isLoading,
    setTableData,
    mutate,
  } = useJobOfferList();

  const updateReceiveResumesByEmail = async (job: Job, checked: boolean) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, jobApplicants, ...rest } = job;
      const updatedJob: Omit<JobOffer, 'id'> = {
        ...rest,
        receivesResumesByEmail: checked,
      };
      await apiService.post(`/job-offer`, updatedJob);
      toast.push(
        <Notification type="success">
          ¡Oferta de Empleo Actualizada!
        </Notification>,
        {
          placement: 'top-center',
        }
      );
      mutate();
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification type="danger">
          ¡Error al actualizar el empleo!
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    }
  };

  const columns: ColumnDef<Job>[] = useMemo(
    () => [
      {
        header: 'Título',
        accessorKey: 'name',
        cell: (props) => {
          const row = props.row.original;
          return <Link to={`/job/${row.uuid}`}><span className="font-semibold">{row.name}</span></Link>;
        },
      },
      {
        header: 'Aplicantes',
        accessorKey: 'applicants',
        cell: (props) => {
          const row = props.row.original;
          return (
            <NumericFormat
              value={row.jobApplicants.length}
              displayType="text"
              thousandSeparator
            />
          );
        },
      },
      {
        header: 'Vacantes',
        accessorKey: 'vacancies',
        cell: (props) => {
          const row = props.row.original;
          return (
            <NumericFormat
              value={row.vacancies}
              displayType="text"
              thousandSeparator
            />
          );
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const { status } = props.row.original;
          return (
            <Tag className={jobOfferStatusColor[status].bgClass}>
              <span
                className={`capitalize font-semibold ${jobOfferStatusColor[status].textClass}`}
              >
                {jobOfferStatusColor[status].label}
              </span>
            </Tag>
          );
        },
      },
      {
        header: 'Fecha de Publicación',
        accessorKey: 'date',
        cell: (props) => {
          const row = props.row.original;
          return (
            <span className="font-semibold">
              {dayjs(row.publicationDate).locale('es').format('DD/MM/YYYY')}
            </span>
          );
        },
      },
      {
        header: 'Envío de CV',
        accessorKey: 'cv',
        cell: (props) => {
          const row = props.row.original;
          return (
            <Switcher
              checked={row.receivesResumesByEmail}
              onChange={(checked) => updateReceiveResumesByEmail(row, checked)}
            />
          );
        },
      },
      {
        header: '',
        id: 'action',
        cell: (props) => (
          <ActionColumn
            row={props.row.original}
            handleDelete={handleDelete}
            handleArchive={handleArchive}
            handleRepublish={handleRepublish}
          />
        ),
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
