import React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ProductTable from './ProductTable';

export default function Products() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <ProductTable/>
        </main>
      </SidebarProvider>
    </>
  );
}
