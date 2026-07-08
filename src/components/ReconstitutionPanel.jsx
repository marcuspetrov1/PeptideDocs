import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table.jsx'

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

      {/* Syringe reference table */}
      <Table className="border-b border-border">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-code-bg font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
              Units (syringe)
            </TableHead>
            <TableHead className="bg-code-bg font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
              Dose
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dose.syringe_reference.map(row => (
            <TableRow key={row.units}>
              <TableCell className="text-[14px] leading-[1.5] text-foreground">{row.units} units</TableCell>
              <TableCell className="text-[14px] leading-[1.5] text-foreground">
                {row.mg != null ? `${row.mg} mg` : `${row.iu} IU`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
          {/* Titration table */}
          <Table className="overflow-hidden rounded-md border border-border">
            <TableHeader>
              <TableRow>
                <TableHead className="bg-code-bg border-b border-border font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                  Weeks
                </TableHead>
                <TableHead className="bg-code-bg border-b border-border font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                  Dose
                </TableHead>
                <TableHead className="bg-code-bg border-b border-border font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                  Units
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dose.titration.map(row => (
                <TableRow key={row.weeks}>
                  <TableCell className="text-[13px] text-foreground">{row.weeks}</TableCell>
                  <TableCell className="text-[13px] text-foreground">
                    {row.dose_mg != null ? `${row.dose_mg} mg` : `${row.dose_iu} IU`}
                  </TableCell>
                  <TableCell className="text-[13px] text-foreground">{row.units}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
