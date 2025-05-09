import { use } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import EditRecipeClient from './EditRecipeClient';

export default function EditRecipePage({ params }) {
  const { id } = use(params);
  return (
    <SidebarLayout>
      <EditRecipeClient id={id} />
    </SidebarLayout>
  );
} 