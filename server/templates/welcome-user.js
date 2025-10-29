const welcomeUser = (userData) => {
  const {
    firstName,
    lastName,
    emailAddress,
    position = []
  } = userData;

  const fullName = `${firstName || ""} ${lastName || ""}`.trim();
  const userRole = position[0]?.label || 'Customer';
  const isStaff = ['MASTER_ADMIN', 'ADMIN', 'RECEPTIONIST'].includes(position[0]?.value);

  // Environment-based URL handling
  const baseUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : (process.env.CLIENT_URL || 'https://johncezarwaterfunresort.com');

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0288d1, #01579b); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 300;">🎉 WELCOME TO THE FAMILY!</h1>
        <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">John Cezar Waterfun Resort</p>
      </div>

      <!-- Welcome Message -->
      <div style="background: #f8f9fa; padding: 30px 20px; border-left: 4px solid #0288d1;">
        <h2 style="margin: 0 0 15px; color: #0288d1; font-size: 24px;">Hello ${fullName}! 👋</h2>
        <p style="margin: 0 0 15px; font-size: 16px; color: #555;">
          Welcome to <strong>John Cezar Waterfun Resort</strong>! We're absolutely thrilled to have you join our community.
        </p>
        <p style="margin: 0; font-size: 16px; color: #555;">
          Your account has been successfully created as a <strong style="color: #0288d1;">${userRole}</strong>. 
          Get ready to experience the ultimate waterfront getaway destination!
        </p>
      </div>

      <!-- Account Details Card -->
      <div style="background: white; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Account Info Banner -->
        <div style="background: #e3f2fd; padding: 15px 20px; border-bottom: 1px solid #bbdefb;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 14px; color: #1976d2; font-weight: 600;">ACCOUNT INFORMATION</span>
            <span style="font-size: 14px; color: #0d47a1; font-weight: bold;">${userRole}</span>
          </div>
        </div>

        <!-- Account Details -->
        <div style="padding: 25px 20px;">
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Full Name</div>
            <div style="font-size: 16px; font-weight: bold; color: #333;">${fullName}</div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Email Address</div>
            <div style="font-size: 16px; font-weight: bold; color: #2e7d32;">${emailAddress}</div>
          </div>

          <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Account Type</div>
            <div style="font-size: 16px; font-weight: bold; color: #1976d2;">${userRole}</div>
          </div>

          ${isStaff ? `
            <div style="background: #fff3e0; padding: 15px; border-radius: 6px; border-left: 4px solid #ff9800; margin-top: 20px;">
              <h4 style="margin: 0 0 8px; color: #ef6c00; font-size: 14px;">Staff Account Access</h4>
              <p style="margin: 0; color: #555; font-size: 14px;">
                You have staff-level access to our management portal. Please keep your login credentials secure and follow company policies.
              </p>
            </div>
          ` : `
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; border-left: 4px solid #4caf50; margin-top: 20px;">
              <h4 style="margin: 0 0 8px; color: #2e7d32; font-size: 14px;">Customer Benefits</h4>
              <p style="margin: 0; color: #555; font-size: 14px;">
                Enjoy exclusive offers, easy booking management, and personalized recommendations for your perfect getaway!
              </p>
            </div>
          `}
        </div>
      </div>

      <!-- Quick Links & Actions -->
      <div style="background: white; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: #e8f4fd; padding: 15px 20px; border-bottom: 1px solid #bbdefb;">
          <h3 style="margin: 0; color: #1976d2; font-size: 18px;">🚀 Get Started</h3>
        </div>
        <div style="padding: 20px;">
          <p style="margin: 0 0 20px; color: #555; font-size: 16px;">
            Here are some quick links to help you get started with your new account:
          </p>
          
          <!-- Quick Action Buttons -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            ${isStaff ? `
              <a href="${baseUrl}/portal" style="background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; padding: 15px; border-radius: 8px; text-decoration: none; text-align: center; font-weight: bold; box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);">
                <div style="font-size: 20px; margin-bottom: 5px;">🏢</div>
                <div>Staff Portal</div>
              </a>
              <a href="${baseUrl}" style="background: white; color: #333; padding: 15px; border-radius: 8px; text-decoration: none; text-align: center; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 2px solid #e0e0e0;">
                <div style="color: #2e7d32; font-size: 20px; margin-bottom: 5px;">🏠</div>
                <div>Visit Website</div>
              </a>
            ` : `
              <a href="${baseUrl}/book-now" style="background: linear-gradient(135deg, #4caf50, #66bb6a); color: white; padding: 15px; border-radius: 8px; text-decoration: none; text-align: center; font-weight: bold; box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);">
                <div style="font-size: 20px; margin-bottom: 5px;">📅</div>
                <div>Book Now</div>
              </a>
              <a href="${baseUrl}" style="background: white; color: #333; padding: 15px; border-radius: 8px; text-decoration: none; text-align: center; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 2px solid #e0e0e0;">
                <div style="color: #2e7d32; font-size: 20px; margin-bottom: 5px;">🏠</div>
                <div>Explore Resort</div>
              </a>
            `}
          </div>

          <!-- Additional Links -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 20px 0;">
            <a href="${baseUrl}/accommodations" style="background: #f8f9fa; padding: 12px; border-radius: 6px; text-decoration: none; text-align: center; color: #333; font-size: 13px; font-weight: 500;">
              <div style="color: #ff9800; font-size: 16px; margin-bottom: 3px;">🏨</div>
              <div>Accommodations</div>
            </a>
            <a href="${baseUrl}/amenities" style="background: #f8f9fa; padding: 12px; border-radius: 6px; text-decoration: none; text-align: center; color: #333; font-size: 13px; font-weight: 500;">
              <div style="color: #2196f3; font-size: 16px; margin-bottom: 3px;">🏊‍♀️</div>
              <div>Amenities</div>
            </a>
            <a href="${baseUrl}/gallery" style="background: #f8f9fa; padding: 12px; border-radius: 6px; text-decoration: none; text-align: center; color: #333; font-size: 13px; font-weight: 500;">
              <div style="color: #9c27b0; font-size: 16px; margin-bottom: 3px;">📸</div>
              <div>Gallery</div>
            </a>
          </div>
        </div>
      </div>

      <!-- What's Next Section -->
      <div style="background: white; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: #fff3e0; padding: 15px 20px; border-bottom: 1px solid #ffcc02;">
          <h3 style="margin: 0; color: #ef6c00; font-size: 18px;">✨ What's Next?</h3>
        </div>
        <div style="padding: 20px;">
          ${isStaff ? `
            <h4 style="margin: 0 0 15px; color: #333; font-size: 16px;">Staff Onboarding Checklist:</h4>
            <ul style="margin: 0 0 20px; padding-left: 20px; color: #555; line-height: 1.8;">
              <li>✅ Account created successfully</li>
              <li>🔐 Set up secure password (completed during registration)</li>
              <li>📚 Review company policies and procedures</li>
              <li>🎯 Access your staff dashboard and familiarize yourself with the interface</li>
              <li>📞 Contact your supervisor for department-specific training</li>
            </ul>
            <div style="background: #e3f2fd; padding: 12px; border-radius: 6px; border-left: 4px solid #2196f3;">
              <p style="margin: 0; color: #1976d2; font-size: 13px; font-weight: 500;">
                💡 Need help? Contact your manager or reach out to our IT support team.
              </p>
            </div>
          ` : `
            <h4 style="margin: 0 0 15px; color: #333; font-size: 16px;">Ready for Your Perfect Getaway?</h4>
            <ul style="margin: 0 0 20px; padding-left: 20px; color: #555; line-height: 1.8;">
              <li>🌊 Explore our beautiful accommodations and amenities</li>
              <li>📅 Check availability and book your preferred dates</li>
              <li>🎁 Subscribe to our newsletter for exclusive offers</li>
              <li>📱 Follow us on social media for updates and inspiration</li>
              <li>⭐ Leave reviews and share your experiences</li>
            </ul>
            <div style="background: #e8f5e8; padding: 12px; border-radius: 6px; border-left: 4px solid #4caf50;">
              <p style="margin: 0; color: #2e7d32; font-size: 13px; font-weight: 500;">
                🎉 Special Welcome Offer: Get 10% off your first booking when you book within 30 days!
              </p>
            </div>
          `}
        </div>
      </div>

      <!-- Contact & Support -->
      <div style="background: white; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: #fce4ec; padding: 15px 20px; border-bottom: 1px solid #f8bbd9;">
          <h3 style="margin: 0; color: #c2185b; font-size: 18px;">📞 Need Help?</h3>
        </div>
        <div style="padding: 20px;">
          <p style="margin: 0 0 15px; color: #555; font-size: 14px;">
            Our friendly team is here to help you with any questions or concerns:
          </p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 6px;">
              <div style="color: #4caf50; font-size: 18px; margin-bottom: 5px;">📧</div>
              <div style="font-size: 12px; color: #666; margin-bottom: 3px;">Email Support</div>
              <div style="font-size: 14px; font-weight: bold; color: #333;">johncezar.waterfun@gmail.com</div>
            </div>
            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 6px;">
              <div style="color: #2196f3; font-size: 18px; margin-bottom: 5px;">📱</div>
              <div style="font-size: 12px; color: #666; margin-bottom: 3px;">Phone Support</div>
              <div style="font-size: 14px; font-weight: bold; color: #333;">+63 917 1224 128</div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 15px;">
            <a href="${baseUrl}/contact-us" style="color: #c2185b; text-decoration: none; font-weight: 500; font-size: 14px;">
              📝 Contact Us Page →
            </a>
          </div>
        </div>
      </div>

      <!-- Footer Message -->
      <div style="text-align: center; padding: 25px 20px; background: linear-gradient(135deg, #e8f5e8, #f1f8e9); border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px; color: #2e7d32; font-size: 20px;">🌴 Welcome to Paradise!</h3>
        <p style="margin: 0 0 20px; font-size: 16px; color: #555; line-height: 1.6;">
          Thank you for joining the John Cezar Waterfun Resort family. We can't wait to create amazing memories with you!
        </p>
        
        <!-- Social Links -->
        <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #c8e6c9;">
          <p style="margin: 0 0 10px; font-size: 14px; color: #666;">Follow us on social media:</p>
          <div style="display: flex; justify-content: center; gap: 15px;">
            <a href="#" style="color: #1976d2; text-decoration: none; font-size: 20px;">📘</a>
            <a href="#" style="color: #e91e63; text-decoration: none; font-size: 20px;">📷</a>
            <a href="#" style="color: #1976d2; text-decoration: none; font-size: 20px;">🐦</a>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #c8e6c9;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            🏖️ John Cezar Waterfun Resort | Your Gateway to Paradise<br>
            This email was sent because you created an account with us. Welcome aboard!
          </p>
        </div>
      </div>

    </div>
  `;
};

export default welcomeUser;