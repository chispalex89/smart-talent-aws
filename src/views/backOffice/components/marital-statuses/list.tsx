import React, { useMemo } from "react";
import { cloneDeep } from "lodash";
import DataTable, {
  ColumnDef,
  OnSortParam,
} from "@/components/shared/DataTable";
import { useMaritalStatusList } from "../../hooks";
import { renderIsDeletedToggle } from "../../../../helpers/renderActiveToggle";
import { Card, Drawer, toast } from "@/components/ui";
import { MaritalStatus } from "@prisma/client";
import GenericForm from "../generic-form";
import ActionTableColumn from "../generic-form/action-table-column";
import apiService from "../../../../services/apiService";
import Notification from "@/components/ui/Notification";

const MaritalStatusList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useMaritalStatusList();

  const [selectedRow, setSelectedRow] = React.useState<MaritalStatus>(
    {} as MaritalStatus
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: MaritalStatus) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleActivate = async (row: MaritalStatus) => {
    try {
      const updatedRow = { ...row, isDeleted: false };
      await apiService.put(`/marital-status/${row.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Estado civil reactivado correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating academic status:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado civil
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as MaritalStatus);
    }
  };
  const handleStatusChange = async (row: MaritalStatus, isDeleted: boolean) => {
    try {
      const updatedRow = { ...row, status: isDeleted ? "inactive" : "active" };
      await apiService.put(`/marital-status/${row.id}`, updatedRow);
      mutate();
    } catch (error) {
      console.error("Error updating marital status:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado civil
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as MaritalStatus);
    }
    setIsDrawerOpen(false);
  };
  const handleDelete = async (row: MaritalStatus) => {
    try {
      await apiService.delete(`/marital-status/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
          Estado civil eliminado correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error deleting marital status:", error);
      toast.push(
        <Notification type="danger">
          Error al eliminar el estado civil
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as MaritalStatus);
      setIsDrawerOpen(false);
    }
  };

  const handleApply = async (updatedRow: MaritalStatus) => {
    try {
      await apiService.put(`/marital-status/${selectedRow.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Estado civil actualizado correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating academic data status:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado del estado civil
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDrawerOpen(false);
      setSelectedRow({} as MaritalStatus);
    }
  };

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
      [sort.key as string]: sort.order ? "desc" : "asc",
    };
    setTableData(newTableData);
  };

  const columns: ColumnDef<MaritalStatus>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Estado Civil",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Descripción",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "status",
        header: "Visible",
        cell: (info) =>
          renderIsDeletedToggle(
            info.getValue() === "active",
            (checked) =>
              handleStatusChange(info.row.original as MaritalStatus, checked),
            "Sí",
            "No"
          ),
      },
      {
        accessorKey: "isDeleted",
        header: "Estado",
        cell: (info) =>
          (info.getValue() ? "Inactivo" : "Activo") ,
      },
      {
        accessorKey: "created_at",
        header: "Fecha de creación",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString("es-GT", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
      },
      {
        accessorKey: "updated_at",
        header: "Última actualización",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString("es-GT", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
      },
      {
        header: "",
        id: "action",
        cell: (props) => (
          <ActionTableColumn
            row={props.row.original}
            onEdit={handleEdit}
            onDelete={props.row.original.isDeleted ? undefined : handleDelete}
            onActivate={
              props.row.original.isDeleted ? handleActivate : undefined
            }
          />
        ),
      },
    ],
    []
  );

  return (
    <>
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
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Detalles de Estado Civil"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as MaritalStatus}
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles del estado civil"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default MaritalStatusList;
