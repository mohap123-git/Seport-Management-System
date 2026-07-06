               function About() {
  return (
    <div style={{ maxWidth:'700px', margin:'0 auto', lineHeight:'1.8' }}>
      <h2 style={{ color:'#1a3c5e' }}>ℹ️ About This Project</h2>
      <table style={{ width:'100%', borderCollapse:'collapse', marginTop:'20px' }}>
        <tbody>
          {[
            ['Project Name',  'Seaport Management System'],
            ['Student Name',  'Mohamed Ahmed Abdullahi'],
            ['Course',        'React + ASP.NET Core Web API'],
            ['Database',      'SQL Server'],
            ['Data Access',   'ADO.NET'],
            ['Backend',       'ASP.NET Core Web API'],
            ['Frontend',      'React'],
            ['API Client',    'Axios'],
          ].map(([k, v]) => (
            <tr key={k} style={{ borderBottom:'1px solid #ddd' }}>
              <td style={{ padding:'10px', fontWeight:'bold', width:'40%', color:'#1a3c5e' }}>{k}</td>
              <td style={{ padding:'10px' }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={{ color:'#1a3c5e', marginTop:'30px' }}>Features</h3>
      <ul>
        <li>Full CRUD for Ships, Docks, Cargo and Arrivals</li>
        <li>Search ships by name</li>
        <li>Filter arrivals by status and date on Report page</li>
        <li>Form validation on all input forms</li>
        <li>React Router navigation across 8 pages</li>
      </ul>
    </div>
  );
}

export default About;
