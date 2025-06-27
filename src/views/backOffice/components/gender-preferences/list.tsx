import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import  {useGenderPreferenceList } from '../../hooks';
import { renderIsDeletedToggle } from '../../../../helpers/renderActiveToggle';
import { Card, Drawer, toast } from '@/components/ui';
import { GenderPreference } from '@prisma/client';
import GenericForm from '../generic-form';
import ActionTableColumn from '../generic-form/action-table-column';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';

const GenderPreferenceStatusList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useGenderPreferenceList();
    console.log('list', list);

  const [selectedRow, setSelectedRow] = React.useState<GenderPreference>(
    {} as GenderPreference
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: GenderPreference) => {
  setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleStatusChange = async (
    row: GenderPreference,
    isDeleted: boolean
  ) => {};

  const handleDelete = async (row: GenderPreference) => {
    try {
      await apiService.delete(`/gender-preferences/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
        Preferencia de género eliminado correctamente
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error('Error deleting gender preference status:', error);
      toast.push(
        <Notification type="danger">
          Error al eliminar la preferencia de género
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as GenderPreference);
      setIsDrawerOpen(false);
    }
  };

    const handleApply = async (updatedRow: GenderPreference) => {
      try {
        await apiService.put(`/gender-preferences/${selectedRow.id}`, updatedRow);
        mutate();
        toast.push(
          <Notification type="info">
            Preferencia de género actualizado correctamente
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } catch (error) {
        console.error('Error updating gender preference status:', error);
        toast.push(
          <Notification type="danger">
            Error al actualizar la preferencia de  género
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } finally {
        setIsDrawerOpen(false);
        setSelectedRow({} as GenderPreference);
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

  const columns: ColumnDef<GenderPreference>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Género',
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
        title="Detalles de Preferencia de género"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as GenderPreference}
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles de la preferencia de género"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default GenderPreferenceStatusList;
