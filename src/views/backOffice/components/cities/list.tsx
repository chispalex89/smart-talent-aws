import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import  { useCityList } from '../../hooks';
import { renderIsDeletedToggle } from '../../../../helpers/renderActiveToggle';
import { Card, Drawer, toast } from '@/components/ui';
import { City } from '@prisma/client';
import GenericForm from '../generic-form';
import ActionTableColumn from '../generic-form/action-table-column';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';

const CityStatusList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useCityList();

  const [selectedRow, setSelectedRow] = React.useState<City>(
    {} as City
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: City) => {
  setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleStatusChange = async (
    row: City,
    isDeleted: boolean
  ) => {};

  const handleDelete = async (row: City) => {
    try {
      await apiService.delete(`/city/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
          Ciudad eliminada correctamente
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error('Error deleting city:', error);
      toast.push(
        <Notification type="danger">
          Error al eliminar la ciudad
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as City);
      setIsDrawerOpen(false);
    }
  };

    const handleApply = async (updatedRow: City) => {
      try {
        await apiService.put(`/city/${selectedRow.id}`, updatedRow);
        mutate();
        toast.push(
          <Notification type="info">
            Ciudad actualizado correctamente
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } catch (error) {
        console.error('Error updating State:', error);
        toast.push(
          <Notification type="danger">
            Error al actualizar la ciudad
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } finally {
        setIsDrawerOpen(false);
        setSelectedRow({} as City);
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

  const columns: ColumnDef<City>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Ciudad',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'state',
        header: 'Departamento',
        cell: (info) => {
          const state = info.getValue();
          return state && typeof state === 'object' && 'name' in state
            ? state.name
            : 'N/A';
        },
      },
      {
        accessorKey: 'state',
        header: 'País',
        cell: (info) => {
          const state = info.getValue();
          const country =
            state &&
            typeof state === 'object' &&
            'country' in state &&
            state.country &&
            typeof state.country === 'object' &&
            'name' in state.country
              ? state.country.name
              : 'N/A';
          return country;
        },
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
        title="Detalles del municipio"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as City}
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles del municipio"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default CityStatusList;
