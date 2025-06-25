import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import { useSkillLevelList } from '../../hooks';
import { renderIsDeletedToggle } from '../../../../helpers/renderActiveToggle';
import { Card, Drawer, toast } from '@/components/ui';
import { SkillLevel } from '@prisma/client';
import GenericForm from '../generic-form';
import ActionTableColumn from '../generic-form/action-table-column';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';

const SkillLevelList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useSkillLevelList();

  const [selectedRow, setSelectedRow] = React.useState<SkillLevel>(
    {} as SkillLevel
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: SkillLevel) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleStatusChange = async (
    row: SkillLevel,
    isDeleted: boolean
  ) => {};

  const handleDelete = async (row: SkillLevel) => {
    try {
      await apiService.delete(`/skill-level/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
         Nivel de habilidad eliminado correctamente
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error('Error deleting skill level:', error);
      toast.push(
        <Notification type="danger">
          Error al eliminar el nivel de habilidad
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as SkillLevel);
      setIsDrawerOpen(false);
    }
  };

    const handleApply = async (updatedRow: SkillLevel) => {
      try {
        await apiService.put(`/skill-level/${selectedRow.id}`, updatedRow);
        mutate();
        toast.push(
          <Notification type="info">
            Nivel de habilidad actualizado correctamente
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } catch (error) {
        console.error('Error updating skill level:', error);
        toast.push(
          <Notification type="danger">
            Error al actualizar el estado del nivel de hablidad
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } finally {
        setIsDrawerOpen(false);
        setSelectedRow({} as SkillLevel);
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

  const columns: ColumnDef<SkillLevel>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nivel de habilidad',
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
            row={info.row.original as SkillLevel}
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
        title="Detalles del nivel de habilidad"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as SkillLevel}          
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles del nivel de habilidad"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default SkillLevelList;
