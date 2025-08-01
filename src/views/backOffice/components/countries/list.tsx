import React, { useMemo } from "react";
import { cloneDeep } from "lodash";
import DataTable, {
  ColumnDef,
  OnSortParam,
} from "@/components/shared/DataTable";
import { useCountryList } from "../../hooks";
import { renderIsDeletedToggle } from "../../../../helpers/renderActiveToggle";
import { Card, Drawer, toast } from "@/components/ui";
import { Country } from "@prisma/client";
import GenericForm from "../generic-form";
import ActionTableColumn from "../generic-form/action-table-column";
import apiService from "../../../../services/apiService";
import Notification from "@/components/ui/Notification";

const CountryStatusList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useCountryList();

  const [selectedRow, setSelectedRow] = React.useState<Country>({} as Country);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: Country) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };
  const handleActivate = async (row: Country) => {
    try {
      const updatedRow = { isDeleted: false };
      await apiService.put(`/country/${row.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">País reactivado correctamente</Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating country:", error);
      toast.push(
        <Notification type="danger">Error al actualizar el país</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as Country);
    }
  };
  const handleStatusChange = async (row: Country, isDeleted: boolean) => {
    try {
      const updatedRow = { ...row, status: isDeleted ? "inactive" : "active" };
      await apiService.put(`/country/${row.id}`, updatedRow);
      mutate();
    } catch (error) {
      console.error("Error updating country:", error);
      toast.push(
        <Notification type="danger">Error al actualizar el país</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as Country);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = async (row: Country) => {
    try {
      await apiService.delete(`/country/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">País eliminado correctamente</Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error deleting country:", error);
      toast.push(
        <Notification type="danger">Error al eliminar el país</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as Country);
      setIsDrawerOpen(false);
    }
  };

  const handleApply = async (updatedRow: Country) => {
    try {
      await apiService.put(`/country/${selectedRow.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">País actualizado correctamente</Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating country:", error);
      toast.push(
        <Notification type="danger">Error al actualizar el país</Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDrawerOpen(false);
      setSelectedRow({} as Country);
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

  const columns: ColumnDef<Country>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "País",
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
              handleStatusChange(
                info.row.original as Country,
                checked
              ),
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
        title="Detalles del País"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as Country}
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles del país"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default CountryStatusList;
