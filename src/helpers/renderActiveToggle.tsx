import { Switcher, Tooltip } from "@/components/ui";

export const renderIsDeletedToggle = (
  isDeleted: boolean,
  onChange: (value: boolean) => void,
  activeText: string = "Sí",
  inactiveText: string = "No"
) => {
  return (
    <div className="flex items-center">
      <Tooltip
        wrapperClass="flex"
        title="Se mostrará en el sistema"
      >
        <Switcher
          checked={!isDeleted}
          onChange={(checked) => onChange(checked)}
          unCheckedContent={inactiveText}
          checkedContent={activeText}
        />
      </Tooltip>
    </div>
  );
};
