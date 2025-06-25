import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import { useEmploymentStatusList } from '../../hooks';
import { renderIsDeletedToggle } from '../../../../helpers/renderActiveToggle';
import { Card, Drawer, toast } from '@/components/ui';
import { EmploymentStatus } from '@prisma/client';
import GenericForm from '../generic-form';
import ActionTableColumn from '../generic-form/action-table-column';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';

 
const EmploymentStatusesList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useEmploymentStatusList();

  const [selectedRow, setSelectedRow] = React.useState<EmploymentStatus>(
    {} as EmploymentStatus
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: EmploymentStatus) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };
  const handleStatusChange = async (
    row: EmploymentStatus,
    isDeleted: boolean
  ) => {};

  const handleDelete = async (row: EmploymentStatus) => {
    try {
      await apiService.delete(`/employment-status/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
         Estado de trabajo eliminado correctamente
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error('Error deleting job hierarchy:', error);
      toast.push(
        <Notification type="danger">
          Error al eliminar el estado de trabajo
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as EmploymentStatus);
      setIsDrawerOpen(false);
    }
  };

    const handleApply = async (updatedRow: EmploymentStatus) => {
      try {
        await apiService.put(`/employment-status/${selectedRow.id}`, updatedRow);
        mutate();
        toast.push(
          <Notification type="info">
            Estado de trabajo actualizado correctamente
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } catch (error) {
        console.error('Error updating employment status:', error);
        toast.push(
          <Notification type="danger">
            Error al actualizar el estado del estado de trabajo
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } finally {
        setIsDrawerOpen(false);
        setSelectedRow({} as EmploymentStatus);
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

  const columns: ColumnDef<EmploymentStatus>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Estado de trabajo',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'isDeleted',
        header: 'Estado',
        cell: (info) =>
          renderIsDeletedToggle(info.getValue() as boolean, () => {}),
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
            row={info.row.original as EmploymentStatus}
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
        title="Detalles del Estado de Trabajo"
      >
        <GenericForm
          initialValues={selectedRow as EmploymentStatus}          
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles del estado de trabajo"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default EmploymentStatusesList;
