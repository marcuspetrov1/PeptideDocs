import { useState } from 'react'
import { Slider } from './ui/slider.jsx'

/**
 * Interactive reconstitution calculator. Seeded from doses[0] when available.
 * Formula: mcgPerUnit = (peptideMassMg * 1000) / (waterVolumeMl * 100)
 * This gives mcg per 1-unit tick on a U-100 (1 mL) syringe.
 */
export default function ReconstitutionCalculator({ defaultMg = 5, defaultMl = 2 }) {
  const [massMg,   setMassMg]   = useState(defaultMg)
  const [waterMl,  setWaterMl]  = useState(defaultMl)

  const mcgPerUnit = (massMg * 1000) / (waterMl * 100)
  const displayValue = Number.isFinite(mcgPerUnit)
    ? mcgPerUnit.toFixed(mcgPerUnit % 1 === 0 ? 0 : 2)
    : '—'

  return (
    <div className="rounded-[10px] border border-border overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-code-bg px-[18px] py-[14px]">
        <span className="font-mono text-[11px] font-semibold tracking-[0.07em] text-muted-foreground uppercase">
          Reconstitution Calculator
        </span>
      </div>

      <div className="flex flex-col gap-6 px-[18px] py-5">
        {/* Mass slider */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-foreground">
              Peptide mass
            </label>
            <span className="font-mono text-[13px] text-primary">{massMg} mg</span>
          </div>
          <Slider
            min={1}
            max={30}
            step={1}
            value={[massMg]}
            onValueChange={([v]) => setMassMg(v)}
            aria-label="Peptide mass in milligrams"
          />
          <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>1 mg</span><span>30 mg</span>
          </div>
        </div>

        {/* Water slider */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-foreground">
              BAC water volume
            </label>
            <span className="font-mono text-[13px] text-primary">{waterMl} mL</span>
          </div>
          <Slider
            min={0.5}
            max={5}
            step={0.5}
            value={[waterMl]}
            onValueChange={([v]) => setWaterMl(v)}
            aria-label="Bacteriostatic water volume in milliliters"
          />
          <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>0.5 mL</span><span>5 mL</span>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-md bg-code-bg px-4 py-3 text-center">
          <p className="m-0 text-[13px] text-muted-foreground">
            Each 1-unit tick on a 1 mL U-100 syringe contains
          </p>
          <p className="m-0 font-heading text-[28px] font-normal tracking-[-0.5px] text-foreground">
            {displayValue} <span className="text-[18px] text-muted-foreground">mcg</span>
          </p>
        </div>

        {/* Legal */}
        <p className="m-0 text-[12px] leading-[1.5] text-muted-foreground">
          <strong>For Research Purposes Only.</strong> Mathematical calculation does not
          constitute dosing advice.
        </p>
      </div>
    </div>
  )
}
