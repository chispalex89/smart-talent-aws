import { Tooltip } from '@/components/ui';
import React from 'react';
import { TbEdit, TbTrash, TbTrashOff } from 'react-icons/tb';

export interface ActionTableColumnProps<T> {
  row: T;
  onActivate?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function ActionTableColumn<T>({
  row,
  onActivate,
  onEdit,
  onDelete,
}: ActionTableColumnProps<T>) {
  return (
    <div className="flex items-center gap-2">
      {onEdit && (
        <Tooltip wrapperClass="flex" title="Editar">
          <span className={`cursor-pointer p-2`} onClick={() => onEdit(row)}>
            <TbEdit color="#3D4490" size={20} />
          </span>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip wrapperClass="flex" title="Eliminar">
          <span
            className="cursor-pointer p-2 hover:text-red-500"
            onClick={() => onDelete(row)}
          >
            <TbTrash color="red" size={20} />
          </span>
        </Tooltip>
      )}
      {onActivate && (
        <Tooltip wrapperClass="flex" title="Activar">
          <span
            className={`cursor-pointer p-2`}
            onClick={() => onActivate(row)}
          >
            <TbTrashOff color="#3D4490" size={20} />
          </span>
        </Tooltip>
      )}
    </div>
  );
}
