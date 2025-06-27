import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import { useWorkShiftList } from '../../hooks';
import { renderIsDeletedToggle } from '../../../../helpers/renderActiveToggle';
import { Card, Drawer, toast } from '@/components/ui';
import { WorkShift } from '@prisma/client';
import GenericForm from '../generic-form';
import ActionTableColumn from '../generic-form/action-table-column';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';

const WorkShiftList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useWorkShiftList();

  const [selectedRow, setSelectedRow] = React.useState<WorkShift>(
    {} as WorkShift
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: WorkShift) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleStatusChange = async (
    row: WorkShift,
    isDeleted: boolean
  ) => {};

  const handleDelete = async (row: WorkShift) => {
    try {
      await apiService.delete(`/work-shift/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
         Horario laboral eliminado correctamente
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error('Error deleting work shift:', error);
      toast.push(
        <Notification type="danger">
          Error al eliminar el horario laboral
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as WorkShift);
      setIsDrawerOpen(false);
    }
  };

    const handleApply = async (updatedRow: WorkShift) => {
      try {
        await apiService.put(`/work-shift/${selectedRow.id}`, updatedRow);
        mutate();
        toast.push(
          <Notification type="info">
            horario laboral actualizado correctamente
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } catch (error) {
        console.error('Error updating profession:', error);
        toast.push(
          <Notification type="danger">
            Error al actualizar el estado del horario laboral
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } finally {
        setIsDrawerOpen(false);
        setSelectedRow({} as WorkShift);
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

  const columns: ColumnDef<WorkShift>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Horario laboral',
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
            row={info.row.original as WorkShift}
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
        title="Detalles del horario laboral"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as WorkShift}          
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles del horario laboral"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default WorkShiftList;
