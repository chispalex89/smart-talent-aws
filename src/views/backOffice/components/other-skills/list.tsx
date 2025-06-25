import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import { useOtherSkillList } from '../../hooks';
import { renderIsDeletedToggle } from '../../../../helpers/renderActiveToggle';
import { Card, Drawer, toast } from '@/components/ui';
import { OtherSkills } from '@prisma/client';
import GenericForm from '../generic-form';
import ActionTableColumn from '../generic-form/action-table-column';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';

const OtherSkillList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useOtherSkillList();

  const [selectedRow, setSelectedRow] = React.useState<OtherSkills>(
    {} as OtherSkills
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: OtherSkills) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleStatusChange = async (
    row: OtherSkills,
    isDeleted: boolean
  ) => {};

  const handleDelete = async (row: OtherSkills) => {
    try {
      await apiService.delete(`/other-skills/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
         Habilidad extra eliminado correctamente
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error('Error deleting Other Skill:', error);
      toast.push(
        <Notification type="danger">
          Error al eliminar el habilidad
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as OtherSkills);
      setIsDrawerOpen(false);
    }
  };

    const handleApply = async (updatedRow: OtherSkills) => {
      try {
        await apiService.put(`/other-skills/${selectedRow.id}`, updatedRow);
        mutate();
        toast.push(
          <Notification type="info">
            Habilidad extra actualizado correctamente
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } catch (error) {
        console.error('Error updating otherSkill:', error);
        toast.push(
          <Notification type="danger">
            Error al actualizar el estado de la habilidad extra
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } finally {
        setIsDrawerOpen(false);
        setSelectedRow({} as OtherSkills);
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

  const columns: ColumnDef<OtherSkills>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Habilidad extra',
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
            row={info.row.original as OtherSkills}
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
        title="Detalles de la habilidad extra"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as OtherSkills}          
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles de la habilidad extra"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default OtherSkillList;
