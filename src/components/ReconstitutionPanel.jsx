export default function ReconstitutionPanel({ dose }) {
  return (
    <div className="mb-9 overflow-hidden rounded-[10px] border border-border">
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-code-bg px-[18px] py-[14px]">
        <span className="font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
          Reconstitution
        </span>
        <span className="flex flex-wrap items-center gap-2 text-[14px] text-foreground">
          {dose.vial_mg == null ? (
            dose.label
          ) : (
            <>
              {dose.vial_mg}mg + {dose.bac_water_ml}mL bac water
              <span className="text-[12px] text-muted-foreground">→</span>
              <strong>{dose.concentration_mg_per_ml} mg/mL</strong>
            </>
          )}
        </span>
      </div>

      <table className="w-full border-collapse border-b border-border">
        <thead>
          <tr>
            <th className="bg-code-bg px-[18px] py-2 text-left font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
              Units (syringe)
            </th>
            <th className="bg-code-bg px-[18px] py-2 text-left font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
              Dose
            </th>
          </tr>
        </thead>
        <tbody className="[&>tr:not(:last-child)>td]:border-b [&>tr:not(:last-child)>td]:border-border">
          {dose.syringe_reference.map(row => (
            <tr key={row.units}>
              <td className="px-[18px] py-2 text-[14px] leading-[1.5] text-foreground">{row.units} units</td>
              <td className="px-[18px] py-2 text-[14px] leading-[1.5] text-foreground">
                {row.mg != null ? `${row.mg} mg` : `${row.iu} IU`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col gap-2 border-b border-border px-[18px] py-4 last:border-b-0">
        <span className="font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
          Protocol
        </span>
        <p className="m-0 text-[14px] leading-[1.65] text-foreground">{dose.dosage_text}</p>
      </div>

      {dose.titration && dose.titration.length > 0 && (
        <div className="flex flex-col gap-2.5 px-[18px] py-4">
          <span className="font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
            Titration schedule
          </span>
          <table className="w-full overflow-hidden rounded-md border-collapse border border-border">
            <thead>
              <tr>
                <th className="bg-code-bg border-b border-border px-[14px] py-2 text-left font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                  Weeks
                </th>
                <th className="bg-code-bg border-b border-border px-[14px] py-2 text-left font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                  Dose
                </th>
                <th className="bg-code-bg border-b border-border px-[14px] py-2 text-left font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                  Units
                </th>
              </tr>
            </thead>
            <tbody className="[&>tr:not(:last-child)>td]:border-b [&>tr:not(:last-child)>td]:border-border">
              {dose.titration.map(row => (
                <tr key={row.weeks}>
                  <td className="px-[14px] py-2 text-[13px] text-foreground">{row.weeks}</td>
                  <td className="px-[14px] py-2 text-[13px] text-foreground">
                    {row.dose_mg != null ? `${row.dose_mg} mg` : `${row.dose_iu} IU`}
                  </td>
                  <td className="px-[14px] py-2 text-[13px] text-foreground">{row.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
