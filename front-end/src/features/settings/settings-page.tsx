export function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Ajustes</h2>
        <p className="text-muted-foreground">
          Espaço reservado para preferências, perfil físico e integrações.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted-foreground">Tema</dt>
            <dd className="mt-1 font-medium">Sistema</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Unidades</dt>
            <dd className="mt-1 font-medium">Métrico</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Notificações</dt>
            <dd className="mt-1 font-medium">Ativas</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
