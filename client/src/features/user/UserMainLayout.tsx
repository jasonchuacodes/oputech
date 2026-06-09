import { Outlet } from 'react-router-dom';

export function UserMainLayout() {
  return (
    <div className="flex h-dvh flex-col">
      <main className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
