import { Switcher } from "@/components/ui";

export const renderIsDeletedToggle = (
  isDeleted: boolean,
  onChange: (value: boolean) => void,
  activeText: string = "Activo",
  inactiveText: string = "Inactivo"
) => {
  return (
    <div className="flex items-center">
      <Switcher
        checked={!isDeleted}
        onChange={(checked) => onChange(checked)}
        unCheckedContent={inactiveText}
        checkedContent={activeText}
      />
    </div>
  );
}