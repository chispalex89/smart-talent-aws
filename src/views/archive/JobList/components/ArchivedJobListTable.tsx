import { useMemo } from "react";
import Tag from "@/components/ui/Tag";
import Tooltip from "@/components/ui/Tooltip";
import DataTable from "@/components/shared/DataTable";
import useJobOfferList from "../hooks/useArchivedJobOfferList";
import cloneDeep from "lodash/cloneDeep";
import { useNavigate } from "react-router-dom";
import { TbEye, TbArchiveOff } from "react-icons/tb";
import dayjs from "dayjs";
import { NumericFormat } from "react-number-format";
import type { OnSortParam, ColumnDef } from "@/components/shared/DataTable";
import type { Job } from "../types";
import type { TableQueries } from "@/@types/common";
import { Switcher, toast } from "@/components/ui";
import apiService from "../../../../services/apiService";
import Notification from "@/components/ui/Notification";
import { JobOffer } from "@prisma/client";
import { on } from "events";

const jobOfferStatusColor: Record<
  string,
  {
    label: string;
    bgClass: string;
    textClass: string;
  }
> = {
  active: {
    label: "Activo",
    bgClass: "bg-success-subtle",
    textClass: "text-success",
  },
  inactive: {
    label: "Inactivo",
    bgClass: "bg-warning-subtle",
    textClass: "text-warning",
  },
  archived: {
    label: "Archivado",
    bgClass: "bg-error-subtle",
    textClass: "text-error",
  },
};

const ActionColumn = ({
  row,
  onViewDetail,
  handleArchive,
}: {
  row: Job;
  onViewDetail: () => void;
  handleArchive: (uuid: string) => void;
}) => {
  const navigate = useNavigate();

  const onEdit = () => {
    navigate(`/job/edit/${row.uuid}`);
  };

  // Add this handler for the restore button
  const onRestore = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents parent click
    handleArchive(row.uuid);
  };

  return (
    <div className="flex justify-end text-lg gap-1">
      <Tooltip wrapperClass="flex" title="Restaurar">
        <span
          className="cursor-pointer p-2"
          onClick={onRestore} // <-- Add this
        >
          <TbArchiveOff color="#FFD027" />
        </span>
      </Tooltip>
      <Tooltip wrapperClass="flex" title="View">
        <span className="cursor-pointer p-2" onClick={onViewDetail}>
          <TbEye />
        </span>
      </Tooltip>
    </div>
  );
};
const ArchivedJobListTable = ({
  handleArchive,
}: {
  handleArchive: (uuid: string) => void;
}) => {
  const {
    jobOfferList,
    jobOfferListTotal,
    tableData,
    isLoading,
    setTableData,
  } = useJobOfferList();
  const navigate = useNavigate();
  const handleViewDetails = (job: Job) => {
    navigate(`/job/${job.uuid}`);
  };

  const columns: ColumnDef<Job>[] = useMemo(
    () => [
      {
        header: "Título",
        accessorKey: "name",
        cell: (props) => {
          const row = props.row.original;
          return <span className="font-semibold">{row.name}</span>;
        },
      },
      {
        header: "Aplicantes",
        accessorKey: "applicants",
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
        header: "Vacantes",
        accessorKey: "vacancies",
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
        header: "Status",
        accessorKey: "status",
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
        header: "Fecha de Publicación",
        accessorKey: "date",
        cell: (props) => {
          const row = props.row.original;
          return (
            <span className="font-semibold">
              {dayjs(row.publicationDate).locale("es").format("DD/MM/YYYY")}
            </span>
          );
        },
      },
      {
        header: "",
        id: "action",
        cell: (props) => (
          <ActionColumn
            row={props.row.original}
            handleArchive={handleArchive}
            onViewDetail={() => {
              handleViewDetails(props.row.original);
            }}
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
      [sort.key as string]: sort.order ? "desc" : "asc",
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

export default ArchivedJobListTable;
