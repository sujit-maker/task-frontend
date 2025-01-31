import React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import CustomerTable from './CustomerTable';

export default function Customers() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <CustomerTable/>
        </main>
      </SidebarProvider>
    </>
  );
}
