import React, { useMemo } from "react";
import { cloneDeep } from "lodash";
import DataTable, {
  ColumnDef,
  OnSortParam,
} from "@/components/shared/DataTable";
import { useSoftwareSkillList } from "../../hooks";
import { renderIsDeletedToggle } from "../../../../helpers/renderActiveToggle";
import { Card, Drawer, toast } from "@/components/ui";
import { SoftwareSkills } from "@prisma/client";
import GenericForm from "../generic-form";
import ActionTableColumn from "../generic-form/action-table-column";
import apiService from "../../../../services/apiService";
import Notification from "@/components/ui/Notification";

const SoftwareSkillsList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useSoftwareSkillList();

  const [selectedRow, setSelectedRow] = React.useState<SoftwareSkills>(
    {} as SoftwareSkills
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: SoftwareSkills) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleActivate = async (row: SoftwareSkills) => {
    try {
      const updatedRow = { ...row, isDeleted: false };
      await apiService.put(`/software-skill/${row.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Habilidad de software reactivada correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating software skill:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar software skill
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as SoftwareSkills);
    }
  };
  const handleStatusChange = async (
    row: SoftwareSkills,
    isDeleted: boolean
  ) => {
    try {
      const updatedRow = { ...row, status: isDeleted ? "inactive" : "active" };
      await apiService.put(`/software-skill/${row.id}`, updatedRow);
      mutate();
    } catch (error) {
      console.error("Error updating software skill:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado de la habilidad de software
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as SoftwareSkills);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = async (row: SoftwareSkills) => {
    try {
      await apiService.delete(`/software-skill/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
          Habilidad de software eliminada correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error deleting software skill:", error);
      toast.push(
        <Notification type="danger">
          Error al eliminar la habilidad de software
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as SoftwareSkills);
      setIsDrawerOpen(false);
    }
  };

  const handleApply = async (updatedRow: SoftwareSkills) => {
    try {
      await apiService.put(`/software-skill/${selectedRow.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Habilidad en software actualizado correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating software skill:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado de la habilidad de software
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsDrawerOpen(false);
      setSelectedRow({} as SoftwareSkills);
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

  const columns: ColumnDef<SoftwareSkills>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Habilidad de software",
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
              handleStatusChange(info.row.original as SoftwareSkills, checked),
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
        id: "actions",
        header: "Acciones",
        cell: (info) => (
          <ActionTableColumn
            row={info.row.original as SoftwareSkills}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
        title="Detalles de la habilidad de software"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as SoftwareSkills}
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles de la habilidad de software"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default SoftwareSkillsList;
