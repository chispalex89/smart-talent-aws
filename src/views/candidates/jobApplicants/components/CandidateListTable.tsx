import { useMemo } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tag from '@/components/ui/Tag';
import DataTable from '@/components/shared/DataTable';
import useCandidateList from '../hooks/useCandidateList';
import { Link, useNavigate } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import type {
  OnSortParam,
  ColumnDef,
  Row,
} from '@/components/shared/DataTable';
import type { Candidate } from '../types';
import type { TableQueries } from '@/@types/common';
import dayjs from 'dayjs';
import { Button, Tooltip } from '@/components/ui';
import {
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiRefresh,
} from 'react-icons/hi';
import {
  calculateAge,
  dateFormat,
  nameFormat,
} from '../../../../helpers/textConverter';
import { BsCloudDownload, BsStar } from 'react-icons/bs';
import { PiArchive, PiUserDuotone, PiWarning } from 'react-icons/pi';
import { TbArchiveFilled, TbArchiveOff } from 'react-icons/tb';
import { profileImageUrl } from '../../../../helpers/s3Url';

const statusColor: Record<string, string> = {
  active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
  inactive: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
};

const statusMap: Record<string, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
};

const NameColumn = ({ row }: { row: Candidate }) => {
  console.log(row);
  return (
    <div className="flex items-center">
      {row.applicant.user.profileImage ? (
        <Avatar
          size={40}
          shape="circle"
          src={profileImageUrl(row.applicant.user.profileImage) ?? ''}
        />
      ) : (
        <PiUserDuotone />
      )}
      <Link
        className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
        to={`/candidates/details/${row.applicant.userId}`}
      >
        {nameFormat(row.applicant.user)}
      </Link>
    </div>
  );
};

const CandidateListTable = ({
  handleArchive,
  handleReport,
  handleFavorite,
  handleDownload,
}: {
  handleArchive: (id: number, unarchive: boolean) => void;
  handleReport: (id: number) => void;
  handleFavorite: (
    id: number,
    jobId: number,
    jobUuid: string,
    unfavorite: boolean
  ) => void;
  handleDownload: (url: string) => void;
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
    navigate(`/candidates/details/${customer.applicant.userId}`);
  };

  const columns: ColumnDef<Candidate>[] = useMemo(
    () => [
      {
        // Make an expander cell
        header: () => null, // No header
        id: 'expander', // It needs an ID
        cell: ({ row }) => (
          <div style={{ width: 30 }}>
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
          </div>
        ),
        size: 50,
      },
      {
        header: 'Nombre',
        accessorKey: 'name',
        cell: (props) => {
          const row = props.row.original;
          return <NameColumn row={row} />;
        },
        size: 200,
      },
      {
        header: 'Email',
        accessorKey: 'email',
        cell: (props) => {
          const row = props.row.original;
          return (
            <span className="font-semibold">{row.applicant.user.email}</span>
          );
        },
        size: 200,
      },
      {
        header: 'Profesión',
        accessorKey: 'profession',
        cell: (props) => {
          const row = props.row.original;
          return (
            <span className="font-semibold">
              {row.applicant.professionalData[0]?.profession?.name || 'N/A'}
            </span>
          );
        },
        size: 150,
      },
      {
        header: 'Trabajo',
        accessorKey: 'job',
        cell: (props) => {
          const row = props.row.original;
          return (
            <span className="font-semibold">
              {row.job?.name || 'N/A'}
            </span>
          );
        }
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const row = props.row.original;
          return (
            <div className="flex items-center">
              <Tag className={statusColor[row.applicant.user.status]}>
                <span className="capitalize">{statusMap[row.applicant.user.status]}</span>
              </Tag>
            </div>
          );
        },
        size: 100,
      },
      {
        header: 'Última Actualización de Perfil',
        accessorKey: 'totalSpending',
        cell: (props) => {
          const row = props.row.original;
          return (
            <span className="font-semibold">
              {dayjs(row.applicant.updated_at || row.applicant.created_at)
                .locale('es')
                .format('DD/MM/YYYY')}
            </span>
          );
        },
        size: 150,
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
          {row.original.applicant.user.profileImage ? (
            <Avatar
              size={200}
              shape="square"
              src={
                profileImageUrl(row.original.applicant.user.profileImage) ?? ''
              }
            />
          ) : (
            <PiUserDuotone size={200} />
          )}
        </div>
        <div className="flex flex-col flex-start gap-2 md:col-span-2">
          <h4>{nameFormat(row.original.applicant.user)}</h4>
          <div className="flex flex-row gap-2 flex-start items-center">
            <Button variant="plain" size="xs" style={{ padding: '0' }}>
              <HiRefresh size={20} />
            </Button>
            <span className="align-bottom">
              Última actualización:{' '}
              {dateFormat(
                row.original.applicant.updated_at ??
                  row.original.applicant.created_at
              )}
            </span>
          </div>
          <span className="text-md font-semibold">
            {row.original.applicant.professionalData[0]?.description || ''}
          </span>
          <span className="text-md font-semibold">
            Área de trabajo:{' '}
            {row.original.applicant.professionalData[0]?.profession?.name}
          </span>
          <span className="text-md font-semibold">
            Edad:{' '}
            {row.original.applicant.personalData[0]?.dateOfBirth
              ? calculateAge(row.original.applicant.personalData[0].dateOfBirth)
              : ''}
          </span>
          <span className="text-md font-semibold">
            Sexo: {row.original.applicant.personalData[0]?.gender.name}
          </span>
          <span className="text-md font-semibold">
            Ubicación:{' '}
            {`${row.original.applicant.personalData[0]?.address} ${row.original.applicant.personalData[0]?.zone ? `Zona ${row.original.applicant.personalData[0]?.zone}` : ''}, ${row.original.applicant.personalData[0]?.city?.name}, ${row.original.applicant.personalData[0]?.city?.state?.name || ''}, ${row.original.applicant.personalData[0]?.city?.state?.country?.name || ''}`}
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-4 items-center">
          <Button
            variant="default"
            size="md"
            className="flex items-center gap-2 max-w-[250px]"
            onClick={() => {
              if (row.original.applicant.companyArchivedApplicants?.length) {
                handleArchive(
                  row.original.applicant.companyArchivedApplicants[0].id,
                  true
                );
              } else {
                handleArchive(row.original.applicant.id, false);
              }
            }}
          >
            {!row.original.applicant.companyArchivedApplicants?.length ? (
              <>
                <TbArchiveFilled color="#ffa527ff" />
                Archivar
              </>
            ) : (
              <>
                <TbArchiveOff color="#ffa527ff" />
                Desarchivar
              </>
            )}
          </Button>

          <Button
            variant="solid"
            size="md"
            customColorClass={() =>
              'border-warning ring-1 ring-warning text-warning hover:bg-warning hover:ring-warning hover:text-white bg-transparent'
            }
            className="flex items-center gap-2 max-w-[250px]"
            onClick={() => {
              if (row.original.applicant.companyFavoriteApplicants?.length) {
                handleFavorite(
                  row.original.applicant.companyFavoriteApplicants[0].id,
                  row.original.applicant.companyFavoriteApplicants[0].jobId ||
                    0,
                  row.original.applicant.companyFavoriteApplicants[0].jobUuid ||
                    '',
                  true
                );
              } else {
                handleFavorite(row.original.applicant.id, 0, '', false);
              }
            }}
          >
            <BsStar />{' '}
            {row.original.applicant.companyFavoriteApplicants?.length
              ? 'Quitar Favorito'
              : 'Favorito'}
          </Button>
          {row.original.applicant.professionalData[0]?.resumeUrl ? (
            <Button
              variant="solid"
              size="md"
              customColorClass={() =>
                'border-blue-500 ring-1 ring-blue-500 text-blue-500 hover:border-blue-500 hover:ring-blue-500 hover:text-white hover:bg-blue-500 bg-transparent'
              }
              className="flex items-center gap-2 max-w-[250px]"
              onClick={() =>
                handleDownload(
                  row.original.applicant.professionalData[0]?.resumeUrl || ''
                )
              }
            >
              <BsCloudDownload /> Descargar CV
            </Button>
          ) : (
            <Tooltip title="No hay CV disponible">
              <Button
                variant="solid"
                size="md"
                disabled
                customColorClass={() =>
                  'border-blue-500 ring-1 ring-blue-500 text-blue-500 hover:border-blue-500 hover:ring-blue-500 hover:text-white hover:bg-blue-500 bg-transparent'
                }
                className="flex items-center gap-2 max-w-[250px]"
                onClick={() => {}}
              >
                <BsCloudDownload /> Descargar CV
              </Button>
            </Tooltip>
          )}
          <Button
            variant="solid"
            size="md"
            customColorClass={() =>
              'border-red-500 ring-1 ring-red-500 text-red-500 hover:border-red-500 hover:ring-red-500 hover:text-white hover:bg-red-500 bg-transparent'
            }
            className="flex items-center gap-2 max-w-[250px]"
            onClick={() => handleReport(row.original.applicant.id)}
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
