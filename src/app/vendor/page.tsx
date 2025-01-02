import React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import VendorTable from './VendorTable';

export default function Vendors() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <VendorTable/>
        </main>
      </SidebarProvider>
    </>
  );
}
