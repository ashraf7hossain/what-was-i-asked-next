"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient, ApiError } from "@/lib/apiClient";

interface ThreeDotEditProps {
  endpoint: string; 
  onEdit?: () => void; 
  onDeleteSuccess?: () => void; 
}

export const ThreeDotEdit = ({
  endpoint,
  onEdit,
  onDeleteSuccess,
}: ThreeDotEditProps) => {
  const { toast } = useToast();

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      toast({
        title: "Edit",
        description: "Edit action triggered.",
      });
      // Implement your custom edit logic if needed
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(endpoint, { requireAuth: true });
      toast({
        title: "Success",
        description: "Item deleted successfully.",
      });
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to delete item";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="sm" className="p-1">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[8rem] bg-white border border-muted shadow-md rounded-md p-1"
          sideOffset={4}
        >
          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-muted hover:rounded-md"
            onSelect={handleEdit}
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
            <span>Edit</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-muted hover:rounded-md"
            onSelect={handleDelete}
          >
            <Trash className="h-4 w-4 text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
