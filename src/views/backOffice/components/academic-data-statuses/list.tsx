import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import { useAcademicHistoryStatusList } from '../../hooks';
import { renderIsDeletedToggle } from '../../../../helpers/renderActiveToggle';
import { Card, Drawer, toast } from '@/components/ui';
import { AcademicDataStatus } from '@prisma/client';
import GenericForm from '../generic-form';
import ActionTableColumn from '../generic-form/action-table-column';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';

const AcademicDataList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useAcademicHistoryStatusList();

  const [selectedRow, setSelectedRow] = React.useState<AcademicDataStatus>(
    {} as AcademicDataStatus
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleEdit = (row: AcademicDataStatus) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleStatusChange = async (
    row: AcademicDataStatus,
    isDeleted: boolean
  ) => {
    try {
      const updatedRow = { ...row, isDeleted };
      await apiService.put(`/academic-status/${row.id}`, updatedRow);
      mutate();
    } catch (error) {
      console.error('Error updating academic data status:', error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado del historial académico
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as AcademicDataStatus);
    }
    setIsDrawerOpen(false);
    toast.push(
      <Notification type="info">
        Estado de historial académico actualizado correctamente
      </Notification>,
      {
        placement: 'top-center',
      }
    );
  };

  const handleDelete = async (row: AcademicDataStatus) => {
    try {
      await apiService.delete(`/academic-status/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
          Estado de historial académico eliminado correctamente
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error('Error deleting academic data status:', error);
      toast.push(
        <Notification type="danger">
          Error al eliminar el estado del historial académico
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as AcademicDataStatus);
      setIsDrawerOpen(false);
    }
  };

  const handleApply = async (updatedRow: AcademicDataStatus) => {
    try {
      await apiService.put(`/academic-status/${selectedRow.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
          Estado de historial académico actualizado correctamente
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error('Error updating academic data status:', error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado del historial académico
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setIsDrawerOpen(false);
      setSelectedRow({} as AcademicDataStatus);
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

  const columns: ColumnDef<AcademicDataStatus>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Estado de Historial Académico',
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
          renderIsDeletedToggle(info.getValue() as boolean, (checked) =>
            handleStatusChange(info.row.original as AcademicDataStatus, checked)
          ),
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
        header: '',
        id: 'action',
        cell: (props) => (
          <ActionTableColumn
            row={props.row.original}
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
        title="Detalles de Estado de Historial Académico"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as AcademicDataStatus}
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles del estado de historial académico"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default AcademicDataList;
