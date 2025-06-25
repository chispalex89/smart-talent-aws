import React, { useMemo } from "react";
import { cloneDeep } from "lodash";
import DataTable, {
  ColumnDef,
  OnSortParam,
} from "@/components/shared/DataTable";
import { useRoleList } from "../../hooks";
import { renderIsDeletedToggle } from "../../../../helpers/renderActiveToggle";
import { Card, Drawer, toast, Tooltip } from "@/components/ui";
import { Role } from "@prisma/client";
import GenericForm from "../generic-form";
import ActionTableColumn from "../generic-form/action-table-column";
import apiService from "../../../../services/apiService";
import Notification from "@/components/ui/Notification";
import { D } from "framer-motion/dist/types.d-O7VGXDJe";

const RoleList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useRoleList();

  const [selectedRow, setSelectedRow] = React.useState<Role>({} as Role);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: Role) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };
const handleStatusChange = async (
    row: Role,
    isDeleted: boolean
  ) => {
    try {
      const updatedRow = { ...row, status: isDeleted ? "inactive" : "active" };
      await apiService.put(`/role/${row.id}`, updatedRow);
      mutate();
    } catch (error) {
      console.error('Error updating role status:', error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado del rol
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as Role);
    }
    setIsDrawerOpen(false);
  
    
  };


  const handleDelete = async (row: Role) => {
    try {
      await apiService.delete(`/role/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">Rol eliminado correctamente</Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error deleting rol:", error);
      toast.push(
        <Notification type="danger">Error al eliminar el rol</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as Role);
      setIsDrawerOpen(false);
    }
  };
  const handleActivate = async (row: Role) => {
    try {
      const updatedRow = { ...row, isDeleted: false };
      await apiService.put(`/role/${row.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Rol reactivado correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating role:", error);
      toast.push(
        <Notification type="danger">Error al actualizar el rol</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as Role);
    }
  };
  const handleApply = async (updatedRow: Role) => {
    try {
      await apiService.put(`/role/${selectedRow.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">Rol actualizado correctamente</Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating rol:", error);
      toast.push(
        <Notification type="danger">Error al actualizar el rol</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDrawerOpen(false);
      setSelectedRow({} as Role);
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

  const columns: ColumnDef<Role>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Rol",
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
          renderIsDeletedToggle(info.getValue() === "active", (checked) =>
            handleStatusChange(info.row.original as Role, checked)),
      },
      {
        accessorKey: "isDeleted",
        header: "Estado",
        cell: (info) => (info.getValue() ? "Inactivo" : "Activo"),
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
            onActivate={props.row.original.isDeleted ? handleActivate : undefined}
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
        title="Detalles del rol"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as Role}
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles del rol"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default RoleList;
