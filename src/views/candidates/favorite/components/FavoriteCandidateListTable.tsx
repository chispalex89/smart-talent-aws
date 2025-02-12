import { useMemo } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tag from '@/components/ui/Tag';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import useFavoriteCandidateList from '../hooks/useFavoriteCandidateList';
import { Link, useNavigate } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import { TbEye, TbTrash } from 'react-icons/tb';
import type {
  OnSortParam,
  ColumnDef,
  Row,
} from '@/components/shared/DataTable';
import type { FavoriteCandidate } from '../types';
import type { TableQueries } from '@/@types/common';
import dayjs from 'dayjs';

const statusColor: Record<string, string> = {
  active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
  inactive: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
};

const NameColumn = ({ row }: { row: FavoriteCandidate }) => {
  return (
    <div className="flex items-center">
      {/* TODO: add image url */}
      <Avatar
        size={40}
        shape="circle"
        src={'api.dicebear.com/7.x/pixel-art/svg'}
      />
      <Link
        className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
        to={`/concepts/customers/customer-details/${row.id}`}
      >
        {`${row.applicant.user.firstName} ${row.applicant.user.middleName ?? ''} ${row.applicant.user.lastName ?? ''} ${row.applicant.user.secondLastName ?? ''} ${row.applicant.user.marriedLastName ?? ''}`}
      </Link>
    </div>
  );
};

const ActionColumn = ({
  onViewDetail,
  onDelete,
}: {
  onViewDetail: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex items-center gap-3">
      <Tooltip title="View">
        <div
          className={`text-xl cursor-pointer select-none font-semibold`}
          role="button"
          onClick={onViewDetail}
        >
          <TbEye />
        </div>
      </Tooltip>
      <Tooltip wrapperClass="flex" title="Eliminar">
        <span
          className="cursor-pointer p-2 hover:text-red-500"
          onClick={onDelete}
        >
          <TbTrash />
        </span>
      </Tooltip>
    </div>
  );
};

const FavoriteCandidateListTable = ({
  handleDelete,
}: {
  handleDelete: (id: number) => void;
}) => {
  const navigate = useNavigate();

  const {
    favoriteCandidateList,
    favoriteCandidateListTotal,
    tableData,
    isLoading,
    setTableData,
    setSelectAllFavoriteCandidate,
    setSelectedFavoriteCandidate,
    selectedFavoriteCandidate,
  } = useFavoriteCandidateList();

  const handleViewDetails = (customer: FavoriteCandidate) => {
    navigate(`/concepts/customers/customer-details/${customer.id}`);
  };

  const columns: ColumnDef<FavoriteCandidate>[] = useMemo(
    () => [
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
          return (
            <span className="font-semibold">{row.applicant.user.email}</span>
          );
        },
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
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const row = props.row.original;
          return (
            <div className="flex items-center">
              <Tag className={statusColor[row.applicant.user.status]}>
                <span className="capitalize">{row.applicant.user.status}</span>
              </Tag>
            </div>
          );
        },
      },
      {
        header: 'Fecha de Aplicación',
        accessorKey: 'totalSpending',
        cell: (props) => {
          const row = props.row.original;
          return (
            <span className="font-semibold">
              {dayjs(row.created_at).locale('es').format('DD/MM/YYYY')}
            </span>
          );
        },
      },
      {
        header: '',
        id: 'action',
        cell: (props) => (
          <ActionColumn
            onViewDetail={() => handleViewDetails(props.row.original)}
            onDelete={() => handleDelete(props.row.original.id)}
          />
        ),
      },
    ],
    [],
  );

  const handleSetTableData = (data: TableQueries) => {
    setTableData(data);
    if (selectedFavoriteCandidate.length > 0) {
      setSelectAllFavoriteCandidate([]);
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

  const handleRowSelect = (checked: boolean, row: FavoriteCandidate) => {
    setSelectedFavoriteCandidate(checked, row);
  };

  const handleAllRowSelect = (
    checked: boolean,
    rows: Row<FavoriteCandidate>[],
  ) => {
    if (checked) {
      const originalRows = rows.map((row) => row.original);
      setSelectAllFavoriteCandidate(originalRows);
    } else {
      setSelectAllFavoriteCandidate([]);
    }
  };

  return (
    <DataTable
      selectable
      columns={columns}
      data={favoriteCandidateList}
      noData={!isLoading && favoriteCandidateList.length === 0}
      skeletonAvatarColumns={[0]}
      skeletonAvatarProps={{ width: 28, height: 28 }}
      loading={isLoading}
      pagingData={{
        total: favoriteCandidateListTotal,
        pageIndex: tableData.pageIndex as number,
        pageSize: tableData.pageSize as number,
      }}
      checkboxChecked={(row) =>
        selectedFavoriteCandidate.some((selected) => selected.id === row.id)
      }
      onPaginationChange={handlePaginationChange}
      onSelectChange={handleSelectChange}
      onSort={handleSort}
      onCheckBoxChange={handleRowSelect}
      onIndeterminateCheckBoxChange={handleAllRowSelect}
    />
  );
};

export default FavoriteCandidateListTable;
