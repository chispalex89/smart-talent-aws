import React, { useMemo } from "react";
import { cloneDeep } from "lodash";
import DataTable, {
  ColumnDef,
  OnSortParam,
} from "@/components/shared/DataTable";
import { useProfessionList } from "../../hooks";
import { renderIsDeletedToggle } from "../../../../helpers/renderActiveToggle";
import { Card, Drawer, toast } from "@/components/ui";
import { Profession } from "@prisma/client";
import GenericForm from "../generic-form";
import ActionTableColumn from "../generic-form/action-table-column";
import apiService from "../../../../services/apiService";
import Notification from "@/components/ui/Notification";

const ProfessionList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useProfessionList();

  const [selectedRow, setSelectedRow] = React.useState<Profession>(
    {} as Profession
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: Profession) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleActivate = async (row: Profession) => {
    try {
      const updatedRow = { ...row, isDeleted: false };
      await apiService.put(`/profession/${row.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Profesión reactivada correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating academic status:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar la profesión
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as Profession);
    }
  };
  const handleStatusChange = async (row: Profession, isDeleted: boolean) => {
    try {
      const updatedRow = { ...row, status: isDeleted ? "inactive" : "active" };
      await apiService.put(`/profession/${row.id}`, updatedRow);
      mutate();
    } catch (error) {
      console.error("Error updating profession:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar la profesión
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as Profession);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = async (row: Profession) => {
    try {
      await apiService.delete(`/profession/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
          Profesión eliminada correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error deleting professión:", error);
      toast.push(
        <Notification type="danger">
          Error al eliminar la profesión
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as Profession);
      setIsDrawerOpen(false);
    }
  };

  const handleApply = async (updatedRow: Profession) => {
    try {
      await apiService.put(`/profession/${selectedRow.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Profesión actualizada correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating profession:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado de la profesión
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDrawerOpen(false);
      setSelectedRow({} as Profession);
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

  const columns: ColumnDef<Profession>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Profesión",
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
              handleStatusChange(info.row.original as Profession, checked),
            "Sí",
            "No"
          ),
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
        id: "actions",
        header: "Acciones",
        cell: (info) => (
          <ActionTableColumn
            row={info.row.original as Profession}
            onEdit={handleEdit}
            onDelete={info.row.original.isDeleted ? undefined : handleDelete}
            onActivate={
              info.row.original.isDeleted ? handleActivate : undefined
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
        title="Detalles de la profesión"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as Profession}
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles de la profesión"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default ProfessionList;
