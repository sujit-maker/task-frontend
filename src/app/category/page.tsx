import React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import CategoryTable from './CategoryTable';

export default function Customers() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <CategoryTable/>
        </main>
      </SidebarProvider>
    </>
  );
}
