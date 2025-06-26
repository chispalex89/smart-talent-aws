import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import { useContractTypeList } from '../../hooks';
import { renderIsDeletedToggle } from '../../../../helpers/renderActiveToggle';
import { Card, Drawer, toast } from '@/components/ui';
import { ContractType } from '@prisma/client';
import GenericForm from '../generic-form';
import ActionTableColumn from '../generic-form/action-table-column';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';

const ContractTypeList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useContractTypeList();

  const [selectedRow, setSelectedRow] = React.useState<ContractType>(
    {} as ContractType
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: ContractType) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };
  const handleActivate = async (row: ContractType) => {
    try {
      const updatedRow = { ...row, isDeleted: false};
      await apiService.put(`/contract-type/${row.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
         Tipo de contrato reactivado correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating contract type:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el tipo de contrato
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as ContractType);
    }
  };
  const handleStatusChange = async (
    row: ContractType,
    isDeleted: boolean
  ) => {
    try {
      const updatedRow = { ...row, status: isDeleted ? "inactive" : "active" };
      await apiService.put(`/contract-type/${row.id}`, updatedRow);
      mutate();
    } catch (error) {
      console.error("Error updating contract type:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado del tipo de contrato
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as ContractType);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = async (row: ContractType) => {
    try {
      await apiService.delete(`/contract-type/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
         Tipo de contrato eliminado correctamente
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error('Error deleting contract type:', error);
      toast.push(
        <Notification type="danger">
          Error al eliminar el tipo de contrato
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as ContractType);
      setIsDrawerOpen(false);
    }
  };

    const handleApply = async (updatedRow: ContractType) => {
      try {
        await apiService.put(`/contract-type/${selectedRow.id}`, updatedRow);
        mutate();
        toast.push(
          <Notification type="info">
            Tipo de contrato actualizado correctamente
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } catch (error) {
        console.error('Error updating contract type:', error);
        toast.push(
          <Notification type="danger">
            Error al actualizar el estado del tipo de contrato
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } finally {
        setIsDrawerOpen(false);
        setSelectedRow({} as ContractType);
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

  const columns: ColumnDef<ContractType>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Tipo de Contrato',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: (info) => info.getValue(),
      },{
        accessorKey: 'status',
        header: 'Visible',
        cell: (info) =>
          renderIsDeletedToggle(
            info.getValue() === 'active',
            (checked) =>handleStatusChange(info.row.original as ContractType, checked)
          ),

      },
      {
        accessorKey: 'isDeleted',
        header: 'Estado',
        cell: (info) =>
          (info.getValue() ? 'Inactivo' : 'Activo')},
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
        cell: (props) => (
          <ActionTableColumn
            row={props.row.original}
            onEdit={handleEdit}
            onDelete={props.row.original.isDeleted ? undefined : handleDelete}
            onActivate={props.row.original.isDeleted ? handleActivate : undefined}
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
        title="Detalles del tipo de contrato"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as ContractType}          
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles del tipo de contrato"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default ContractTypeList;
 