import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import { useJobHierarchyList } from '../../hooks';
import { renderIsDeletedToggle } from '../../../../helpers/renderActiveToggle';
import { Card, Drawer, toast } from '@/components/ui';
import { JobHierarchy } from '@prisma/client';
import GenericForm from '../generic-form';
import ActionTableColumn from '../generic-form/action-table-column';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';
import { checkPrime } from 'crypto';

const JobHierarchyList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useJobHierarchyList();

  const [selectedRow, setSelectedRow] = React.useState<JobHierarchy>(
    {} as JobHierarchy
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: JobHierarchy) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };
  const handleActivate = async (row: JobHierarchy) => {
    try {
      const updatedRow = { ...row, isDeleted: false};
      await apiService.put(`/job-hierarchy/${row.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Jerarquía laboral reactivada correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating job hierarchy:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado académico
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as JobHierarchy);
    }
  };
  const handleStatusChange = async (
    row: JobHierarchy,
    isDeleted: boolean
  ) => {
    try {
      const updatedRow = { ...row, status: isDeleted ? "inactive" : "active" };
      await apiService.put(`/job-hierarchy/${row.id}`, updatedRow);
      mutate();
    } catch (error) {
      console.error("Error updating job hierarchy:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar la jerarquía de trabajo
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as JobHierarchy);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = async (row: JobHierarchy) => {
    try {
      await apiService.delete(`/job-hierarchy/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
         Jerarquia de trabajo eliminada correctamente
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error('Error deleting job hierarchy:', error);
      toast.push(
        <Notification type="danger">
          Error al eliminar la jerarquía de trabajo
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as JobHierarchy);
      setIsDrawerOpen(false);
    }
  };

    const handleApply = async (updatedRow: JobHierarchy) => {
      try {
        await apiService.put(`/job-hierarchy/${selectedRow.id}`, updatedRow);
        mutate();
        toast.push(
          <Notification type="info">
            Jerarquia de trabajo actualizada correctamente
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } catch (error) {
        console.error('Error updating job hierarchy:', error);
        toast.push(
          <Notification type="danger">
            Error al actualizar el estado de la jerarquía de trabajo
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } finally {
        setIsDrawerOpen(false);
        setSelectedRow({} as JobHierarchy);
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
      [sort.key as string]: sort.order ? 'desc' : 'asc',
    };
    setTableData(newTableData);
  };

  const columns: ColumnDef<JobHierarchy>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Jerarquía de trabajo',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Visible',
        cell: (info) =>
          renderIsDeletedToggle(info.getValue() === 'active', (checked)=> handleStatusChange(info.row.original as JobHierarchy, checked)),
      },{
        accessorKey: 'isDeleted',
        header: 'Estado',
        cell: (info) => (info.getValue() ? 'Inactivo' : 'Activo'),
      },
      {
        accessorKey: 'created_at',
        header: 'Fecha de creación',
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString('es-GT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
      },
      {
        accessorKey: 'updated_at',
        header: 'Última actualización',
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString('es-GT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: (info) => (
          <ActionTableColumn
            row={info.row.original as JobHierarchy}
            onEdit={handleEdit}
            onDelete={info.row.original.isDeleted ? undefined : handleDelete}
            onActivate={info.row.original.isDeleted ? handleActivate : undefined}
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
        title="Detalles de jerarquía de trabajo"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as JobHierarchy}          
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles de la jerarquía de trabajo"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default JobHierarchyList;
