import React, { useMemo } from "react";
import { cloneDeep } from "lodash";
import DataTable, {
  ColumnDef,
  OnSortParam,
} from "@/components/shared/DataTable";
import { useStateList } from "../../hooks";
import { renderIsDeletedToggle } from "../../../../helpers/renderActiveToggle";
import { Card, Drawer, toast } from "@/components/ui";
import { State } from "@prisma/client";
import GenericForm from "../generic-form";
import ActionTableColumn from "../generic-form/action-table-column";
import apiService from "../../../../services/apiService";
import Notification from "@/components/ui/Notification";

const StateStatusList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useStateList();

  const [selectedRow, setSelectedRow] = React.useState<State>({} as State);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: State) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleActivate = async (row: State) => {
    try {
      const updatedRow = { isDeleted: false };
      await apiService.put(`/state/${row.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Estado reactivado correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating state:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as State);
    }
  };

  const handleStatusChange = async (row: State, isDeleted: boolean) => {
    try {
      const updatedRow = { ...row, status: isDeleted ? "inactive" : "active" };
      await apiService.put(`/state/${row.id}`, updatedRow);
      mutate();
    } catch (error) {
      console.error("Error updating state:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as State);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = async (row: State) => {
    try {
      await apiService.delete(`/state/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">Estado eliminado correctamente</Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error deleting state :", error);
      toast.push(
        <Notification type="danger">Error al eliminar el estado</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as State);
      setIsDrawerOpen(false);
    }
  };

  const handleApply = async (updatedRow: State) => {
    try {
      await apiService.put(`/state/${selectedRow.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Estado actualizado correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating State:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDrawerOpen(false);
      setSelectedRow({} as State);
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

  const columns: ColumnDef<State>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Estado",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Descripción",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "country",
        header: "País",
        cell: (info) => {
          const country = info.getValue();
          return country && typeof country === "object" && "name" in country
            ? country.name
            : "N/A";
        },
      },
      {
        accessorKey: "status",
        header: "Visible",
        cell: (info) =>
          renderIsDeletedToggle(
            info.getValue() === "active",
            (checked) =>
              handleStatusChange(info.row.original as State, checked),
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
        title="Detalles del Estado"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as State}
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles del estado"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default StateStatusList;
