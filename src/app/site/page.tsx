import React from 'react';
import { AppSidebar } from '../components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import SiteTable from './SiteTable';

export default function Users() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <SiteTable/>
          
        </main>
      </SidebarProvider>
    </>
  );
}
