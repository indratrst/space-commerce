import { CategoryResponse } from "@/lib/validation/category.schema";
import {
  CreateProduct,
  ProductResponse,
} from "@/lib/validation/products.schema";

export type ProductFormProps = {
  initialData?: Partial<CreateProduct>;
  categories?: CategoryResponse[];
  onSubmitAction: (data: CreateProduct) => Promise<void>;
  isLoading?: boolean;
};

export type ProductTableProps = {
  products: ProductResponse[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
};
