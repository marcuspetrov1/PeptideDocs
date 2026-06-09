export default function DoseSelector({ doses, selectedIdx, onChange }) {
  if (doses.length < 2) return null

  return (
    <select
      className="dose-selector"
      value={selectedIdx}
      onChange={e => onChange(Number(e.target.value))}
      aria-label="Select vial size"
    >
      {doses.map((dose, i) => (
        <option key={dose.label} value={i}>
          {dose.label}
        </option>
      ))}
    </select>
  )
}
