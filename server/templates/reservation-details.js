import { PROD_URL } from "../constants/constants.js";
import { formatDateInTimeZone } from "../utils/formatDate.js";
import { isNightBooking, getNightDisplayStrings } from "../utils/bookingMode.js";

const reservationDetails = (reservationData) => {
  const {
    reservationId,
    userData,
    startDate,
    endDate,
    guests,
    status,
    amount,
    accommodationData,
    policies = [],
    faqs = []
  } = reservationData;

  // Using shared formatter for consistency across emails/SMS

  const guestName = `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();
  const isNight = isNightBooking({
    mode: reservationData?.mode,
    isDayMode: reservationData?.isDayMode,
    startDate,
    endDate,
  });

  const { start: nightStart, end: nightEnd } = getNightDisplayStrings(startDate, endDate);
  const formattedStartDate = isNight ? nightStart : formatDateInTimeZone(startDate, { includeTime: true });
  const formattedEndDate = isNight ? nightEnd : formatDateInTimeZone(endDate, { includeTime: true });

  // Environment-based URL handling
  const baseUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : PROD_URL

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0288d1, #01579b); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 300;">🌊 BOOKING CONFIRMATION</h1>
        <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">John Cezar Waterfun Resort</p>
      </div>

      <!-- Guest Welcome -->
      <div style="background: #f8f9fa; padding: 25px 20px; border-left: 4px solid #0288d1;">
        <h2 style="margin: 0 0 10px; color: #0288d1; font-size: 20px;">Dear ${guestName},</h2>
        <p style="margin: 0; font-size: 16px; color: #555;">Thank you for choosing our resort! We're excited to host you for an unforgettable experience.</p>
      </div>

      <!-- Reservation Details Card -->
      <div style="background: white; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Reservation ID Banner -->
        <div style="background: #e3f2fd; padding: 15px 20px; border-bottom: 1px solid #bbdefb;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 14px; color: #1976d2; font-weight: 600;">RESERVATION ID</span>
            <span style="font-size: 18px; font-weight: bold; color: #0d47a1; letter-spacing: 1px;">${reservationId}</span>
          </div>
        </div>

        <!-- Stay Details -->
        <div style="padding: 25px 20px;">
          <h3 style="margin: 0 0 20px; color: #333; font-size: 18px; border-bottom: 2px solid #e3f2fd; padding-bottom: 8px;">📅 Stay Details</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
              <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Check-in</div>
              <div style="font-size: 16px; font-weight: bold; color: #2e7d32;">${formattedStartDate}</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
              <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Check-out</div>
              <div style="font-size: 16px; font-weight: bold; color: #d32f2f;">${formattedEndDate}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
            <div>
              <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Guests</div>
              <div style="font-size: 16px; font-weight: bold; color: #333;">${guests} ${guests > 1 ? 'Guests' : 'Guest'}</div>
            </div>
            <div>
              <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Status</div>
              <div style="font-size: 16px; font-weight: bold; color: ${status === "CONFIRMED" ? "#2e7d32" : status === "PENDING" ? "#ff9800" : "#d32f2f"};">
                ${status === "CONFIRMED" ? "✅ " : status === "PENDING" ? "⏳ " : status === "CANCELLED" ? "❌ " : "📋 "}${status}
              </div>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">🏨 Your Accommodation</div>
            <div style="background: white; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e0e0e0;">
              ${accommodationData?.thumbnail ? `
                <div style="height: 120px; background: url('${accommodationData.thumbnail}') center/cover; position: relative;">
                  <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); padding: 15px 20px;">
                    <div style="color: white; font-size: 18px; font-weight: bold;">${accommodationData.name}</div>
                  </div>
                </div>
              ` : `
                <div style="padding: 20px; background: linear-gradient(135deg, #4caf50, #2e7d32); color: white;">
                  <div style="font-size: 18px; font-weight: bold;">${accommodationData?.name || 'Accommodation'}</div>
                </div>
              `}
              <div style="padding: 15px 20px;">
                ${accommodationData?.description ? `<p style="margin: 0 0 10px; color: #555; line-height: 1.5;">${accommodationData.description}</p>` : ''}
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
                  <div>
                    <div style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Day Rate</div>
                    <div style="font-size: 16px; font-weight: bold; color: #2e7d32;">₱${accommodationData?.price?.day?.toLocaleString() || 'N/A'}</div>
                  </div>
                  <div>
                    <div style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px;">Night Rate</div>
                    <div style="font-size: 16px; font-weight: bold; color: #2e7d32;">₱${accommodationData?.price?.night?.toLocaleString() || 'N/A'}</div>
                  </div>
                </div>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666; font-size: 12px;">Max Capacity:</span>
                    <span style="color: #2e7d32; font-weight: bold;">${accommodationData?.capacity || 'N/A'} guests</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666; font-size: 12px;">Pool Access:</span>
                    <span style="color: ${accommodationData?.hasPoolAccess ? '#2e7d32' : '#666'}; font-weight: bold;">${accommodationData?.hasPoolAccess ? 'Yes' : 'No'}</span>
                  </div>
                  ${accommodationData?.extraPersonFee ? `
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: #666; font-size: 12px;">Extra Person Fee:</span>
                      <span style="color: #ef6c00; font-weight: bold;">₱${accommodationData.extraPersonFee.toLocaleString()}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Summary -->
      <div style="background: white; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: #fff3e0; padding: 15px 20px; border-bottom: 1px solid #ffcc02;">
          <h3 style="margin: 0; color: #ef6c00; font-size: 18px;">💰 Payment Summary</h3>
        </div>
        <div style="padding: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0;">
            <span style="color: #666;">Total Amount:</span>
            <span style="font-weight: bold; font-size: 16px;">₱${amount?.total?.toLocaleString() || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0;">
            <span style="color: #666;">Amount Paid:</span>
            <span style="font-weight: bold; color: #2e7d32; font-size: 16px;">₱${amount?.totalPaid?.toLocaleString() || 0}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px 0; background: #f8f9fa; margin: 0 -20px; padding-left: 20px; padding-right: 20px;">
            <span style="font-weight: bold; color: #333;">Balance Due:</span>
            <span style="font-weight: bold; font-size: 18px; color: ${((amount?.total || 0) - (amount?.totalPaid || 0)) > 0 ? '#d32f2f' : '#2e7d32'};">
              ₱${((amount?.total || 0) - (amount?.totalPaid || 0)).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <!-- Booking Instructions -->
      <div style="background: white; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: #e8f4fd; padding: 15px 20px; border-bottom: 1px solid #bbdefb;">
          <h3 style="margin: 0; color: #1976d2; font-size: 18px;">📋 Important Booking Information</h3>
        </div>
        <div style="padding: 20px;">
          <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px; color: #333; font-size: 16px;">Check-in Instructions:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.6;">
              <li>Check-in time: on or before ${formattedStartDate}</li>
              <li>Please bring a valid ID and this confirmation email</li>
              <li>Early check-in may be available upon request (subject to availability)</li>
            </ul>
          </div>
          <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px; color: #333; font-size: 16px;">Check-out Instructions:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.6;">
              <li>Check-out time: on or before ${formattedEndDate}</li>
              <li>Please settle any outstanding balance before departure</li>
            </ul>
          </div>
          <div style="background: #fff3e0; padding: 15px; border-radius: 6px; border-left: 4px solid #ff9800;">
            <h4 style="margin: 0 0 8px; color: #ef6c00; font-size: 14px;">What to Bring:</h4>
            <p style="margin: 0; color: #555; font-size: 14px;">Swimming attire, sunscreen, towels, comfortable clothing, and personal toiletries. We provide fresh linens and basic amenities.</p>
          </div>
        </div>
      </div>

      <!-- Resort Policies -->
      <div style="background: white; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: #fce4ec; padding: 15px 20px; border-bottom: 1px solid #f8bbd9;">
          <h3 style="margin: 0; color: #c2185b; font-size: 18px;">📜 Resort Policies</h3>
        </div>
        <div style="padding: 20px;">
          ${policies.length > 0 ? policies.map(policy => `
            <div style="margin-bottom: 20px;">
              <h4 style="margin: 0 0 8px; color: #333; font-size: 14px; font-weight: bold;">${policy.title}:</h4>
              <p style="margin: 0 0 15px; color: #555; font-size: 14px; line-height: 1.5;">${policy.content}</p>
            </div>
          `).join('') : `
            <div style="margin-bottom: 15px;">
              <h4 style="margin: 0 0 8px; color: #333; font-size: 14px; font-weight: bold;">Cancellation & Refund Policy:</h4>
              <p style="margin: 0 0 15px; color: #555; font-size: 14px; line-height: 1.5;">
                • No cancellation, no refund!<br>
              </p>
            </div>
            <div style="margin-bottom: 15px;">
              <h4 style="margin: 0 0 8px; color: #333; font-size: 14px; font-weight: bold;">House Rules:</h4>
              <p style="margin: 0 0 15px; color: #555; font-size: 14px; line-height: 1.5;">
                • No smoking inside accommodations<br>
                • Quiet hours: 10:00 PM - 7:00 AM<br>
                • Maximum occupancy strictly enforced<br>
              </p>
            </div>
          `}
          <div style="background: #ffebee; padding: 12px; border-radius: 6px; border-left: 4px solid #f44336; margin-bottom: 15px;">
            <p style="margin: 0; color: #c62828; font-size: 13px; font-weight: 500;">
              ⚠️ Failure to comply with resort policies may result in additional charges or termination of stay without refund.
            </p>
          </div>
          <div style="text-align: center; margin-top: 15px;">
            <a href="${baseUrl}/policies" style="color: #c2185b; text-decoration: none; font-weight: 500; font-size: 14px;">
              📖 View All Policies →
            </a>
          </div>
        </div>
      </div>

      <!-- Frequently Asked Questions -->
      <div style="background: white; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: #e8f5e8; padding: 15px 20px; border-bottom: 1px solid #c8e6c9;">
          <h3 style="margin: 0; color: #2e7d32; font-size: 18px;">❓ Frequently Asked Questions</h3>
        </div>
        <div style="padding: 20px;">
          ${faqs.length > 0 ? faqs.map(faq => `
            <div style="margin-bottom: 20px;">
              <h4 style="margin: 0 0 8px; color: #333; font-size: 14px; font-weight: bold;">${faq.title}</h4>
              <p style="margin: 0 0 15px; color: #555; font-size: 14px; line-height: 1.5;">${faq.answer}</p>
            </div>
          `).join('') : `
            <div style="margin-bottom: 20px;">
              <h4 style="margin: 0 0 8px; color: #333; font-size: 14px; font-weight: bold;">Is WiFi available?</h4>
              <p style="margin: 0 0 15px; color: #555; font-size: 14px;">Yes, complimentary WiFi is available throughout the resort premises.</p>
            </div>
            <div style="margin-bottom: 20px;">
              <h4 style="margin: 0 0 8px; color: #333; font-size: 14px; font-weight: bold;">Are meals included?</h4>
              <p style="margin: 0 0 15px; color: #555; font-size: 14px;">Meals are not included but can be arranged for an additional fee. Our restaurant serves local and international cuisine.</p>
            </div>
            <div style="margin-bottom: 20px;">
              <h4 style="margin: 0 0 8px; color: #333; font-size: 14px; font-weight: bold;">What activities are available?</h4>
              <p style="margin: 0 0 15px; color: #555; font-size: 14px;">Swimming, water sports, beach volleyball, kayaking, and guided island tours. Activity schedules available at reception.</p>
            </div>
          `}
          <div style="background: #e3f2fd; padding: 12px; border-radius: 6px; border-left: 4px solid #2196f3; margin-bottom: 15px;">
            <p style="margin: 0; color: #1976d2; font-size: 13px;">
              💡 Have more questions? Contact our front desk at any time during your stay!
            </p>
          </div>
          <div style="text-align: center; margin-top: 15px;">
            <a href="${baseUrl}/faqs" style="color: #2e7d32; text-decoration: none; font-weight: 500; font-size: 14px;">
              📝 View All FAQs →
            </a>
          </div>
        </div>
      </div>

      <!-- Footer Message -->
      <div style="text-align: center; padding: 25px 20px; background: linear-gradient(135deg, #e8f5e8, #f1f8e9); border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px; color: #2e7d32; font-size: 20px;">🌴 We Can't Wait to Welcome You!</h3>
        <p style="margin: 0 0 20px; font-size: 16px; color: #555; line-height: 1.6;">
          Get ready for sun, fun, and unforgettable memories at John Cezar Waterfun Resort. 
          Should you have any questions or special requests, please don't hesitate to contact us.
        </p>
        
        <!-- Quick Links -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; padding-top: 20px; border-top: 1px solid #c8e6c9;">
          <a href="${baseUrl}/portal/reservations" style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-decoration: none; text-align: center; color: #333;">
            <div style="color: #2e7d32; font-size: 18px; margin-bottom: 5px;">📋</div>
            <div style="font-weight: bold; font-size: 13px;">Manage Booking</div>
          </a>
          <a href="${baseUrl}" style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-decoration: none; text-align: center; color: #333;">
            <div style="color: #2e7d32; font-size: 18px; margin-bottom: 5px;">🏠</div>
            <div style="font-weight: bold; font-size: 13px;">Visit Website</div>
          </a>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #c8e6c9;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            🏖️ John Cezar Waterfun Resort | Your Gateway to Paradise<br>
            Thank you for choosing us for your vacation experience!
          </p>
        </div>
      </div>

    </div>
  `;
};

export default reservationDetails;