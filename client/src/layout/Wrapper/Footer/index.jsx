import { FacebookOutlined } from '@ant-design/icons'
import React from 'react'

const index = () => {
  return (
     <footer
  style={{
    backgroundColor: "#004b80",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    padding: "16px 0", 
    
  }}
>
  <div
    style={{
      maxWidth: "1500px",
      maxHeight: "110px",
      margin: "auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
      gap: "15px", 
      padding: "0 2px",
    }}
  >
    {/* Discover */}
    <div>
      <h4
        style={{
          color: "#ffdd00",
          margin: "0 0 4px 0", 
          borderBottom: "1px solid #ffdd00",
          display: "inline-block",
          fontSize: "20px",
          fontFamily: "Cinzel",
        }}
      >
        Discover
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.4, fontSize: "14px", fontFamily: "Cinzel"}}>
        <li>
          <a href="#" style={{ color: "#fff", textDecoration: "none" }}>
            #WatermazingExperience
          </a>
        </li>
      </ul>
    </div>

    {/* Resort Info */}
    <div>
      <h4
        style={{
          color: "#ffdd00",
          margin: "0 0 4px 0",

          borderBottom: "1px solid #ffdd00",
          display: "inline-block",
          fontSize: "20px",
          fontFamily: "Cinzel",
        }}
      >
        Resort Info
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.4, fontSize: "14px", fontFamily: "Cinzel"}}>
        <li><a href="#" style={{ color: "#fff", textDecoration: "none" }}>Rules & Regulations</a></li>
        <li><a href="#" style={{ color: "#fff", textDecoration: "none" }}>Amenities</a></li>
        <li><a href="#" style={{ color: "#fff", textDecoration: "none" }}>Shops</a></li>
      </ul>
    </div>

    {/* About Us */}
    <div>
      <h4
        style={{
          color: "#ffdd00",
          margin: "0 0 4px 0",
          borderBottom: "1px solid #ffdd00",
          display: "inline-block",
          fontSize: "20px",
          fontFamily: "Cinzel",
        }}
      >
        About Us
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.4, fontSize: "14px", fontFamily: "Cinzel"}}>
        <li><a href="#" style={{ color: "#fff", textDecoration: "none" }}>Contact Us</a></li>
        <li><a href="#" style={{ color: "#fff", textDecoration: "none" }}>Media</a></li>
        <li><a href="#" style={{ color: "#fff", textDecoration: "none" }}>FAQs</a></li>
        <li><a href="#" style={{ color: "#fff", textDecoration: "none" }}>Privacy Policy</a></li>
      </ul>
    </div>

    {/* Contact Info */}
    <div>
      <h4
        style={{
          color: "#ffdd00",
          margin: "0 0 4px 0",
          borderBottom: "1px solid #ffdd00",
          display: "inline-block",
          fontSize: "20px",
          fontFamily: "Cinzel",
        }}
      >
        Contact Information
      </h4>
      <p style={{ margin: "4px 0", lineHeight: 1.4, fontSize: "14px", fontFamily: "Cinzel"}}>
        📍 Address: R5 Brgy. Langkaan II, Dasmarinas Cavite <br />
        ☎ 0917-123-4567 <br />
        ✉ info@johncezarresort.com
      </p>
    </div>
  </div>

  {/* Bottom Bar */}
  <div
    style={{
      textAlign: "center",
      padding: "1px 1px 0 1px", 
      borderTop: "1px solid #000000ff",
      marginTop: "15px",
    }}
  >
    <p style={{ margin: "2px 0", fontSize: "12px", fontFamily: "Cinzel"}}>© Copyrights JohnCezar Waterfun Resort. All rights reserved.</p>
    <div style={{ marginTop: "4px" }}>
      <span style={{ fontWeight: "bold", fontSize: "13px", fontFamily: "Cinzel", }}>GET SOCIAL</span>
      <br />
      <a href="#" style={{ color: "#fff", margin: "0 6px", fontSize: "16px" }}><FacebookOutlined /></a>
      
    </div>
  </div>
</footer>
  )
}

export default index
