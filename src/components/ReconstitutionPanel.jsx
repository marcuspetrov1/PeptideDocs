export default function ReconstitutionPanel({ dose }) {
  return (
    <div className="recon-panel">
      <div className="recon-panel__header">
        <span className="recon-panel__label">Reconstitution</span>
        <span className="recon-panel__formula">
          {dose.vial_mg}mg + {dose.bac_water_ml}mL bac water
          <span className="recon-panel__arrow">→</span>
          <strong>{dose.concentration_mg_per_ml} mg/mL</strong>
        </span>
      </div>

      <table className="recon-panel__syringe-table">
        <thead>
          <tr>
            <th>Units (syringe)</th>
            <th>Dose</th>
          </tr>
        </thead>
        <tbody>
          {dose.syringe_reference.map(row => (
            <tr key={row.units}>
              <td>{row.units} units</td>
              <td>{row.mg} mg</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="recon-panel__dosage">
        <span className="recon-panel__dosage-label">Protocol</span>
        <p className="recon-panel__dosage-text">{dose.dosage_text}</p>
      </div>

      {dose.titration && dose.titration.length > 0 && (
        <div className="recon-panel__titration">
          <span className="recon-panel__dosage-label">Titration schedule</span>
          <table className="recon-panel__titration-table">
            <thead>
              <tr>
                <th>Weeks</th>
                <th>Dose</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              {dose.titration.map(row => (
                <tr key={row.weeks}>
                  <td>{row.weeks}</td>
                  <td>{row.dose_mg} mg</td>
                  <td>{row.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
