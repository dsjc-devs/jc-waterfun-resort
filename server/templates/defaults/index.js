import header from "./header.js";
import footer from "./footer.js";
import ResortDetails from "../../models/resortDetailsModels.js";

const getCompanyDetails = async () => {
  try {
    const companyDetails = await ResortDetails.findOne()
    const { companyInfo } = companyDetails || {};

    return companyInfo
  } catch (error) {
    throw new Error("Failed to fetch company details");
  }
}

const emailTemplate = async (body) => {
  const companyDetails = await getCompanyDetails();

  const addressObj = companyDetails?.address || {};
  const address = [
    addressObj.streetAddress || '',
    addressObj.city || '',
    addressObj.province || '',
    addressObj.country || ''
  ].filter(Boolean).join(', ');

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td>
                  ${header(companyDetails?.logo, companyDetails?.name)}
                </td>
              </tr>
              <tr>
                <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
                  ${body}
                </td>
              </tr>
              <tr>
                <td>
                  ${footer(companyDetails?.name, address, companyDetails?.emailAddress, companyDetails?.phoneNumber)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

export default emailTemplate;
