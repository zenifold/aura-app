import { useOrganization } from "@/hooks/use-organization";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Organization {
  id: string;
  name: string;
}

interface OrganizationSwitcherProps {
  organizations: Organization[];
}

export const OrganizationSwitcher = ({
  organizations,
}: OrganizationSwitcherProps) => {
  const { organization, setOrganization } = useOrganization();

  const currentOrganization = organization || organizations[0];

  const onOrganizationSelect = (organizationId: string) => {
    const selected = organizations.find((org) => org.id === organizationId);
    if (selected) {
      setOrganization(selected);
    }
  };

  return (
    <Select
      value={currentOrganization?.id}
      onValueChange={onOrganizationSelect}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
