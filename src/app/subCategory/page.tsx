import React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { SidebarProvider} from '@/components/ui/sidebar';
import SubCategoryTable from './SubCategoryTable';

export default function Customers() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SubCategoryTable/>
        </main>
      </SidebarProvider>
    </>
  );
}
