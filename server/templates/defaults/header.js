const header = (logo, name) => {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" 
      style="background: linear-gradient(135deg, #4fc3f7, #0288d1); padding:30px; text-align:center;">
      <tr>
        <td>
          <img src="${logo}" alt="${name}" width="100" 
            style="display:block; margin:0 auto 10px auto; border-radius:50%; background:#fff; padding:8px;" />
          <h1 style="margin:0; font-size:26px; font-family:Arial, sans-serif; color:#ffffff;">
            ${name}
          </h1>
          <p style="margin:5px 0 0 0; font-size:14px; color:#e3f2fd; font-style:italic;">
            “Relax • Refresh • Reconnect”
          </p>
        </td>
      </tr>
    </table>
  `;
};

export default header;
