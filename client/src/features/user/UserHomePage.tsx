import { Button } from '../../shared/components';

export default function UserHomePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 h-full">
      <h1 className="text-4xl font-semibold tracking-tight">Oputech</h1>
      <p className="text-muted-foreground">Welcome home.</p>
      <Button>Get started</Button>
    </div>
  );
}
