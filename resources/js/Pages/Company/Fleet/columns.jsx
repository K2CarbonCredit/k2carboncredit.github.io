import { Link } from '@inertiajs/react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export const columns = [
    {
        accessorKey: "make.name",
        header: "Make",
    },
    {
        accessorKey: "model.name",
        header: "Model",
    },
    {
        accessorKey: "registration_number",
        header: "Registration No.",
    },
    {
        accessorKey: "chassis_number",
        header: "Chassis No.",
    },
    {
        accessorKey: "fuel_type",
        header: "Fuel Type",
        cell: ({ row }) => (
            <Badge variant="secondary">
                {row.original.fuel_type}
            </Badge>
        ),
    },
    {
        accessorKey: "onboarding_status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.onboarding_status === 'completed' ? 'success' : 'warning'}>
                {row.original.onboarding_status}
            </Badge>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Link href={route('company.fleet.edit', row.original.id)}>
                    <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                    </Button>
                </Link>
                <Link
                    href={route('company.fleet.destroy', row.original.id)}
                    method="delete"
                    as="button"
                    preserveScroll
                >
                    <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                </Link>
            </div>
        ),
    },
];
