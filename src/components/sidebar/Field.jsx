export function FieldLabel({ icon: Icon, children, value }) {
  return (
    <label className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" /> {children}
      </span>
      {value != null && <span className="tabular-nums">{value}</span>}
    </label>
  )
}


export function Field({ children }) {
  return <div className="flex flex-col gap-2">{children}</div>
}
