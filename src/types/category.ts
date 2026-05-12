import {
  CategoryResponse,
  CreateCategory,
} from "@/lib/validation/category.schema";

// Additional types for component props
export type CategoryFormProps = {
  initialData?: Partial<CreateCategory>;
  onSubmit: (data: CreateCategory) => Promise<void>;
  isLoading?: boolean;
};

export type CategoryTableProps = {
  categories: CategoryResponse[];
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
};
