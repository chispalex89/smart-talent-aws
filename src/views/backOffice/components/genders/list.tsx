import React, { useMemo } from "react";
import { cloneDeep } from "lodash";
import DataTable, {
  ColumnDef,
  OnSortParam,
} from "@/components/shared/DataTable";
import { useGenderList } from "../../hooks";
import { renderIsDeletedToggle } from "../../../../helpers/renderActiveToggle";
import { Card, Drawer, toast } from "@/components/ui";
import { Gender } from "@prisma/client";
import GenericForm from "../generic-form";
import ActionTableColumn from "../generic-form/action-table-column";
import apiService from "../../../../services/apiService";
import Notification from "@/components/ui/Notification";

const GenderStatusList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useGenderList();

  const [selectedRow, setSelectedRow] = React.useState<Gender>({} as Gender);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: Gender) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };
  const handleActivate = async (row: Gender) => {
    try {
      const updatedRow = { ...row, isDeleted: false };
      await apiService.put(`/gender/${row.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Género reactivado correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating academic status:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado del género
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as Gender);
    }
  };
  const handleStatusChange = async (row: Gender, isDeleted: boolean) => {
    try {
      const updatedRow = { ...row, status: isDeleted ? "inactive" : "active" };
      await apiService.put(`/gender/${row.id}`, updatedRow);
      mutate();
    } catch (error) {
      console.error("Error updating gender:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el género
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as Gender);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = async (row: Gender) => {
    try {
      await apiService.delete(`/gender/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">Género eliminado correctamente</Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error deleting gender :", error);
      toast.push(
        <Notification type="danger">Error al eliminar el género</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as Gender);
      setIsDrawerOpen(false);
    }
  };

  const handleApply = async (updatedRow: Gender) => {
    try {
      await apiService.put(`/gender/${selectedRow.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Género actualizado correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating gender status:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado del género
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDrawerOpen(false);
      setSelectedRow({} as Gender);
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

  const columns: ColumnDef<Gender>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Género",
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
              handleStatusChange(info.row.original as Gender, checked),
            "Sí",
            "No"
          ),
      },
      {
        accessorKey: "isDeleted",
        header: "Estado",
        cell: (info) =>
          (info.getValue() ? "Inactivo" : "Activo"),
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
        title="Detalles del Género"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as Gender}
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles de género"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default GenderStatusList;
