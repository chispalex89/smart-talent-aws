import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DataTable, {
  ColumnDef,
  OnSortParam,
} from '@/components/shared/DataTable';
import  { useDriverLicenseTypeList } from '../../hooks';
import { renderIsDeletedToggle } from '../../../../helpers/renderActiveToggle';
import { Card, Drawer, toast } from '@/components/ui';
import { DriverLicense } from '@prisma/client';
import GenericForm from '../generic-form';
import ActionTableColumn from '../generic-form/action-table-column';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';

const DriverLicenseStatusList = () => {
  const { list, total, tableData, isLoading, setTableData, mutate } =
    useDriverLicenseTypeList();

  const [selectedRow, setSelectedRow] = React.useState<DriverLicense>(
    {} as DriverLicense
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleEdit = (row: DriverLicense) => {
  setSelectedRow(row);
    setIsDrawerOpen(true);
  };
  const handleActivate = async (row: DriverLicense) => {
    try {
      const updatedRow = { ...row, isDeleted: false};
      await apiService.put(`/driver-license/${row.id}`, updatedRow);
      mutate();
      toast.push(
        <Notification type="info">
        Licencia de conducir reactivada correctamente
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      console.error("Error updating driver license:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar la licencia de conducir
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as DriverLicense);
    }
  };
  const handleStatusChange = async (
    row: DriverLicense ,
    isDeleted: boolean
  ) => {
    try {
      const updatedRow = { ...row, status: isDeleted ? "inactive" : "active" };
      await apiService.put(`/driver-license/${row.id}`, updatedRow);
      mutate();
    } catch (error) {
      console.error("Error updating driver license status:", error);
      toast.push(
        <Notification type="danger">
          Error al actualizar el estado de la licencia de conducir
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSelectedRow({} as DriverLicense);
    }
    setIsDrawerOpen(false);
  };


  const handleDelete = async (row: DriverLicense) => {
    try {
      await apiService.delete(`/driver-license/${row.id}`);
      mutate();
      toast.push(
        <Notification type="info">
          Licencia de conducir eliminada correctamente
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      console.error('Error deleting a driver license :', error);
      toast.push(
        <Notification type="danger">
          Error al eliminar la licencia de conducir
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      setSelectedRow({} as DriverLicense);
      setIsDrawerOpen(false);
    }
  };

    const handleApply = async (updatedRow: DriverLicense) => {
      try {
        await apiService.put(`/driver-license/${selectedRow.id}`, updatedRow);
        mutate();
        toast.push(
          <Notification type="info">
          Licencia de conducir actualizado correctamente
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } catch (error) {
        console.error('Error updating State:', error);
        toast.push(
          <Notification type="danger">
            Error al actualizar la licencia de conducir
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      } finally {
        setIsDrawerOpen(false);
        setSelectedRow({} as DriverLicense);
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

  const columns: ColumnDef<DriverLicense>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Licencia de conducir',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: (info) => info.getValue(),
      },{
        accessorKey: 'status',
        header: 'Visible',
        cell: (info) => renderIsDeletedToggle(
          info.getValue() === 'active',
        (checked)=> handleStatusChange(info.row.original as DriverLicense, checked), "Sí", "No"
        )
        },
      {
        accessorKey: 'isDeleted',
        header: 'Eliminado',
        cell: (info) =>
          (info.getValue() ? 'Inactivo' : 'Activo'),
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
            onDelete={props.row.original.isDeleted ? undefined : handleDelete}
            onActivate={
              props.row.original.isDeleted ? handleActivate : undefined
            }
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
        title="Detalles de la licencia de conducir"
        closable={true}
      >
        <GenericForm
          initialValues={selectedRow as DriverLicense}
          onSubmit={(item) => handleApply(item)}
          onCancel={() => setIsDrawerOpen(false)}
          submitButtonText="Guardar Cambios"
          cancelButtonText="Cancelar"
          subTitle="Complete los detalles de la licencia de conducir"
        ></GenericForm>
      </Drawer>
    </>
  );
};

export default DriverLicenseStatusList;
