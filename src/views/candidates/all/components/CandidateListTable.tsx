import { useMemo } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tag from '@/components/ui/Tag';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import useCandidateList from '../hooks/useCandidateList';
import { Link, useNavigate } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import { TbEye, TbTrash } from 'react-icons/tb';
import type {
  OnSortParam,
  ColumnDef,
  Row,
  ExpandedState,
} from '@/components/shared/DataTable';
import type { Candidate } from '../types';
import type { TableQueries } from '@/@types/common';
import dayjs from 'dayjs';
import { Button, Card } from '@/components/ui';
import {
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineMinusCircle,
  HiOutlinePlusCircle,
  HiRefresh,
} from 'react-icons/hi';
import {
  calculateAge,
  dateFormat,
  nameFormat,
} from '../../../../helpers/textConverter';
import { BsCloudDownload, BsStar } from 'react-icons/bs';
import {
  PiArchive,
  PiFloppyDisk,
  PiUserDuotone,
  PiWarning,
} from 'react-icons/pi';

const statusColor: Record<string, string> = {
  active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
  inactive: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
};

const statusMap: Record<string, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
};

const NameColumn = ({ row }: { row: Candidate }) => {
  return (
    <div className="flex items-center">
      {row.user.profileImage ? (
        <Avatar size={40} shape="circle" src={row.user.profileImage} />
      ) : (
        <PiUserDuotone />
      )}
      <Link
        className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
        to={`/concepts/customers/customer-details/${row.id}`}
      >
        {nameFormat(row.user)}
      </Link>
    </div>
  );
};

const CandidateListTable = ({
  handleDelete,
  handleArchive,
  handleReport,
  handleFavorite,
  handleDownload,
}: {
  handleDelete: (id: number) => void;
  handleArchive: (id: number) => void;
  handleReport: (id: number) => void;
  handleFavorite: (id: number) => void;
  handleDownload: (id: number) => void;
}) => {
  const navigate = useNavigate();

  const {
    candidateList,
    candidateListTotal,
    tableData,
    isLoading,
    setTableData,
    setSelectAllCandidate,
    setSelectedCandidate,
    selectedCandidates,
  } = useCandidateList();

  const handleViewDetails = (customer: Candidate) => {
    navigate(`/concepts/customers/customer-details/${customer.id}`);
  };

  const columns: ColumnDef<Candidate>[] = useMemo(
    () => [
      {
        // Make an expander cell
        header: () => null, // No header
        id: 'expander', // It needs an ID
        cell: ({ row }) => (
          <>
            {row.getCanExpand() ? (
              <button
                className="text-lg"
                {...{ onClick: row.getToggleExpandedHandler() }}
              >
                {row.getIsExpanded() ? (
                  <HiOutlineChevronDown />
                ) : (
                  <HiOutlineChevronRight />
                )}
              </button>
            ) : null}
          </>
        ),
      },
      {
        header: 'Nombre',
        accessorKey: 'name',
        cell: (props) => {
          const row = props.row.original;
          return <NameColumn row={row} />;
        },
      },
      {
        header: 'Email',
        accessorKey: 'email',
        cell: (props) => {
          const row = props.row.original;
          return <span className="font-semibold">{row.user.email}</span>;
        },
      },
      {
        header: 'Profesión',
        accessorKey: 'profession',
        cell: (props) => {
          const row = props.row.original;
          return (
            <span className="font-semibold">
              {row.professionalData[0]?.profession?.name || 'N/A'}
            </span>
          );
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const row = props.row.original;
          return (
            <div className="flex items-center">
              <Tag className={statusColor[row.user.status]}>
                <span className="capitalize">{statusMap[row.user.status]}</span>
              </Tag>
            </div>
          );
        },
      },
      {
        header: 'Última Actualización de Perfil',
        accessorKey: 'totalSpending',
        cell: (props) => {
          const row = props.row.original;
          return (
            <span className="font-semibold">
              {dayjs(row.updated_at || row.created_at)
                .locale('es')
                .format('DD/MM/YYYY')}
            </span>
          );
        },
      },
    ],
    []
  );

  const handleSetTableData = (data: TableQueries) => {
    setTableData(data);
    if (selectedCandidates.length > 0) {
      setSelectAllCandidate([]);
    }
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
    newTableData.sort = { [sort.key]: sort.order };
    handleSetTableData(newTableData);
  };

  const handleRowSelect = (checked: boolean, row: Candidate) => {
    setSelectedCandidate(checked, row);
  };

  const handleAllRowSelect = (checked: boolean, rows: Row<Candidate>[]) => {
    if (checked) {
      const originalRows = rows.map((row) => row.original);
      setSelectAllCandidate(originalRows);
    } else {
      setSelectAllCandidate([]);
    }
  };

  const renderSubComponent = (row: Row<Candidate>) => {
    return (
      <div className="grid md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          {row.original.user.profileImage ? (
            <Avatar size={200} shape="square" src={row.original.user.profileImage} />
          ) : (
            <PiUserDuotone size={200}/>
          )}
        </div>
        <div className="flex flex-col flex-start gap-2 md:col-span-2">
          <h4>{nameFormat(row.original.user)}</h4>
          <div className="flex flex-row gap-2 flex-start items-center">
            <Button variant="plain" size="xs" style={{ padding: '0' }}>
              <HiRefresh size={20} />
            </Button>
            <span className="align-bottom">
              Última actualización:{' '}
              {dateFormat(row.original.updated_at ?? row.original.created_at)}
            </span>
          </div>
          <span className="text-md font-semibold">
            {row.original.professionalData[0]?.description || ''}
          </span>
          <span className="text-md font-semibold">
            Área de trabajo: {row.original.professionalData[0]?.profession?.name}
          </span>
          <span className="text-md font-semibold">
            Edad:{' '}
            {row.original.personalData[0]?.dateOfBirth
              ? calculateAge(row.original.personalData[0].dateOfBirth)
              : ''}
          </span>
          <span className="text-md font-semibold">
            Sexo: {row.original.personalData[0]?.gender.name}
          </span>
          <span className="text-md font-semibold">
            Ubicación:{' '}
            {`${row.original.personalData[0]?.address} ${row.original.personalData[0]?.zone ? `Zona ${row.original.personalData[0]?.zone}` : ''}, ${row.original.personalData[0]?.city?.name}, ${row.original.personalData[0]?.city?.state?.name || ''}, ${row.original.personalData[0]?.city?.state?.country?.name || ''}`}
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-4 items-center">
          <Button
            variant="solid"
            size="md"
            className="flex items-center gap-2 max-w-[250px]"
            customColorClass={() =>
              'border-success ring-1 ring-success text-success hover:bg-success hover:ring-success hover:text-white bg-transparent'
            }
          >
            <PiFloppyDisk />
            Guardar
          </Button>
          <Button
            variant="default"
            size="md"
            className="flex items-center gap-2 max-w-[250px]"
            onClick={() => handleArchive(row.original.id)}
          >
            <PiArchive />
            Archivar
          </Button>
          <Button
            variant="solid"
            size="md"
            customColorClass={() =>
              'border-warning ring-1 ring-warning text-warning hover:bg-warning hover:ring-warning hover:text-white bg-transparent'
            }
            className="flex items-center gap-2 max-w-[250px]"
            onClick={() => handleFavorite(row.original.id)}
          >
            <BsStar /> Favorito
          </Button>
          <Button
            variant="solid"
            size="md"
            customColorClass={() =>
              'border-blue-500 ring-1 ring-blue-500 text-blue-500 hover:border-blue-500 hover:ring-blue-500 hover:text-white hover:bg-blue-500 bg-transparent'
            }
            className="flex items-center gap-2 max-w-[250px]"
            onClick={() => handleDownload(row.original.id)}
          >
            <BsCloudDownload /> Descargar CV
          </Button>
          <Button
            variant="solid"
            size="md"
            customColorClass={() =>
              'border-red-500 ring-1 ring-red-500 text-red-500 hover:border-red-500 hover:ring-red-500 hover:text-white hover:bg-red-500 bg-transparent'
            }
            className="flex items-center gap-2 max-w-[250px]"
            onClick={() => handleReport(row.original.id)}
          >
            <PiWarning /> Reportar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <DataTable
      selectable
      columns={columns}
      data={candidateList}
      noData={!isLoading && candidateList.length === 0}
      skeletonAvatarColumns={[0]}
      skeletonAvatarProps={{ width: 50, height: 50 }}
      loading={isLoading}
      pagingData={{
        total: candidateListTotal,
        pageIndex: tableData.pageIndex as number,
        pageSize: tableData.pageSize as number,
      }}
      checkboxChecked={(row) =>
        selectedCandidates.some((selected) => selected.id === row.id)
      }
      onPaginationChange={handlePaginationChange}
      onSelectChange={handleSelectChange}
      onSort={handleSort}
      onCheckBoxChange={handleRowSelect}
      onIndeterminateCheckBoxChange={handleAllRowSelect}
      getRowCanExpand={() => true}
      renderSubComponent={(row) => renderSubComponent(row)}
    />
  );
};

export default CandidateListTable;
