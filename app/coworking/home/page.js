'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import './home.css'
import { FaCalendarAlt, FaMicrophone, FaTools, FaTrash } from "react-icons/fa";



export default function CoworkingHomePage() {
  const router = useRouter()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  const [showConfirmation, setShowConfirmation] = useState(false); // ไว้ show confrim logout
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // ไว้ show confirm ลบไอดี
  
  useEffect(() => {
    // ตรวจสอบข้อมูลผู้ใช้จาก localStorage เมื่อโหลดหน้า
    const checkAuth = () => {
      const userData = localStorage.getItem('user')
      if (!userData) {
        // ถ้าไม่มีข้อมูลผู้ใช้ (ยังไม่ล็อกอิน) ให้กลับไปที่หน้าล็อกอิน
        router.push('/coworking')
      } else {
        try {
          // แปลงข้อมูลผู้ใช้จาก JSON string
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          
          // ไว้เทสหน้า loadding
          // setTimeout(() => {
          //   setLoading(false)
          // }, 9000)
        
        } catch (err) {
          console.error('Error parsing user data:', err)
          localStorage.removeItem('user')
          router.push('/coworking')
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user') // ล้างข้อมูลผู้ใช้จาก localStorage
    router.push('/coworking')
    setShowConfirmation(false);
  }

  const [isDeleting, setIsDeleting] = useState(false);

  // Add this function to your page.js file
  // แก้ไขฟังก์ชัน handleDeleteAccount ในไฟล์ page.js
// แก้ไขฟังก์ชัน handleDeleteAccount ในไฟล์ page.js
const handleDeleteAccount = async () => {
  setIsDeleting(true); // แสดงสถานะกำลังลบ
  
  try {
    if (!user || !user.User_ID || isNaN(user.User_ID)) {
      console.error('Invalid User ID');
      alert('รหัสผู้ใช้ไม่ถูกต้อง');
      setIsDeleting(false);
      return;
    }
    
    console.log('Attempting to delete user with ID:', user.User_ID);
    
    try {
      // เปลี่ยนจาก /api/users/delete เป็น /api/users/delete
      // (ไม่ต้องเปลี่ยน path แต่อาจต้องตรวจสอบว่า Next.js กำลังใช้ App Router หรือ Pages Router)
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: parseInt(user.User_ID, 10) }),
      });
      
      console.log('Response status:', response.status);
      
      // ตรวจสอบว่ามี content หรือไม่ก่อนแปลงเป็น JSON
      const text = await response.text();
      console.log('Response text:', text);
      
      let data = {};
      if (text && text.trim() !== '') {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          console.error('Raw response:', text);
        }
      }
      
      if (response.ok) {
        // ลบสำเร็จ - ล้าง localStorage และกลับไปหน้าล็อกอิน
        alert('ลบบัญชีผู้ใช้เรียบร้อยแล้ว');
        localStorage.removeItem('user');
        router.push('/coworking');
      } else {
        // แสดงข้อความผิดพลาด
        alert(data.error || `ไม่สามารถลบบัญชีผู้ใช้ได้: ${response.status}`);
        setShowDeleteConfirmation(false);
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์: ' + fetchError.message);
      setShowDeleteConfirmation(false);
    }
  } catch (error) {
    console.error('General error:', error);
    alert('เกิดข้อผิดพลาดในการลบบัญชีผู้ใช้: ' + error.message);
    setShowDeleteConfirmation(false);
  } finally {
    setIsDeleting(false); // ยกเลิกสถานะกำลังลบ
  }
};

  // แสดงหน้าจอโหลด (ซึ่งมันเร็วมากกกกกกกกกกกกกกกก)
  if (loading) {
    return (
      <div className="loading-screenHome"></div>
    )
  }
  
  return (
    <div className="Main-home-page"> {/* 1 */}
      
      {/* --------------------------- AppBar ---------------------------- */}
      <header className="site-header">  {/* 2 */}
        <div className="header-container"> {/* 3 */}
           
            <Link href="/coworking/home" className="site-title">Co Working Space</Link>  {/* 4 */}
            <div className="nav-container"> {/* 5 */}

            <nav className="nav-menu">
              <Link href="/coworking/topup/history" className="nav-link">
                Topup History
              </Link>
            </nav>
            
            {/* <nav className="nav-menu">
              <Link href="/coworking/bookinghistory" className="nav-link">
                Booking History
              </Link>
            </nav> */}
          </div>


          <div className="containerLeft"> {/* 6 */}
            {user && (
              <button onClick={() => router.push('/coworking/topup')} className="wallet-balance">  {/* 7 */}
                <span className="balance-label">ยอดเงิน: </span>  {/* 8 */}
                <span className="balance-amount">  {/* 9 */}
                  {parseFloat(user.Balance).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
                </span>
              </button>
            )}

            <button 
              onClick={() => setShowConfirmation(true)}
              className="logout-button"
            >  {/* 10 */}
              ออกจากระบบ
            </button>
          </div>
            
        </div>
      </header>


      {showConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-dialog">
            <h3 className="dialog-title">ยืนยันการออกจากระบบ</h3>
            <p className="dialog-message">คุณต้องการออกจากระบบใช่หรือไม่?</p>

              <button
                onClick={() => setShowConfirmation(false)}
                className="cancel-button"
              >
                ยกเลิก
              </button>

              <button
                onClick={handleLogout}
                className="confirm-button"
              >
                ยืนยัน
              </button>

          </div>
        </div>
      )}

      {/* Modal ยืนยันการลบบัญชีผู้ใช้ */}
      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-dialog">
            <h3 className="dialog-title">ยืนยันการลบบัญชีผู้ใช้</h3>
            <p className="dialog-message">คุณต้องการลบบัญชีผู้ใช้นี้ใช่หรือไม่?</p>
            <p className="dialog-message warning-text">เงินที่ท่านมีอยู่ในระบบ {parseFloat(user.Balance).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท ไม่สามารถขอคืนได้</p>

              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="cancel-button"
              >
                ยกเลิก
              </button>

              <button
                onClick={handleDeleteAccount}
                className="confirm-button delete-button"
              >
                ยืนยันการลบบัญชี
              </button>

          </div>
        </div>
      )}



      {/* --------------------------- ข้อมูลผู้ใช้ --------------------------- */}
      <div className="home-container">
          <div className="content-card2">
            
            <h2 className="section-title">ข้อมูลผู้ใช้</h2>
            {user && (
                <div className="profile-container">
                  <div className="profile-grid">
                    <div className="profile-item">
                      <p className="profile-label">ชื่อผู้ใช้</p>
                      <p className="profile-value">{user.User_Name}</p>
                    </div>

                    <div className="profile-item">
                      <p className="profile-label">ชื่อ-นามสกุล</p>
                      <p className="profile-value">{user.First_Name} {user.Last_Name}</p>
                    </div>

                    <div className="profile-item">
                      <p className="profile-label">อีเมล</p>
                      <p className="profile-value">{user.U_Email}</p>
                    </div>

                    <div className="profile-item">
                      <p className="profile-label">เบอร์โทรศัพท์</p>
                      <p className="profile-value">{user.U_Phone}</p>
                    </div>

                    <div className="profile-item">
                      <p className="profile-label">สถานะกระเป๋าเงิน</p>
                      <p className="profile-value">
                        <span className="status-dot"></span>
                        ใช้งานได้
                      </p>
                    </div>

                    <div className="profile-item">
                      <p className="profile-label">วันที่ลงทะเบียน</p>
                      <p className="profile-value">
                        {new Date(user.Registration_Date).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowDeleteConfirmation(true)} 
                    className="delete-account-button"
                  >
                    <FaTrash className="delete-icon" /> ลบไอดี
                  </button>
                </div>
            )}
          </div>


          {/* --------------------------- รายการห้อง --------------------------- */}
          <div className="content-card2">
            <h2 className="section-title">บริการของเรา</h2>

            <div className="services-grid">

              <div className="room-card">
                <div className="room-header">
                  <h3 className="room-title">Meeting Room Type A</h3>
                  <p className="room-subtitle">ห้องประชุมขนาดเล็ก (จำนวน 6 ห้อง)</p>
                </div>
                
                <img src="https://uppic.cloud/ib/jQDKTvs0cLelFWA_1744981465.jpg" className="setPic" />

                <div className="room-features-list">
                  <li className="room-feature">ความจุ 8 คน</li>
                  <li className="room-feature">โต๊ะประชุมทรงสี่เหลี่ยมผืนผ้า</li>
                  <li className="room-feature">จอแสดงผล 55 นิ้ว</li>
                  <li className="room-feature">ระบบเสียงคุณภาพสูง</li>
                  <li className="room-feature">wifi ความเร็วสูง</li>
                  <li className="room-feature">ระบบประชุมทางไกล</li>
                </div>

                <button onClick={() => window.location.href = "/coworking/meetingroom/mta"} className="room-link-button">
                  จองห้องประชุม
                </button>
              </div>



              <div className="room-card">
                <div className="room-header">
                  <h3 className="room-title">Meeting Room Type B</h3>
                  <p className="room-subtitle">ห้องประชุมขนาดกลาง (จำนวน 6 ห้อง)</p>
                </div>
                
                <img src="https://uppic.cloud/ib/rMn9A1xD3lSDE4y_1744981466.jpg" className="setPic" />

                <div className="room-features-list">
                  <li className="room-feature">ความจุ 14 คน</li>
                  <li className="room-feature">โต๊ะประชุมทรงตัวยู</li>
                  <li className="room-feature">จอแสดงผล 65 นิ้ว</li>
                  <li className="room-feature">wifi ความเร็วสูง</li>
                  <li className="room-feature">ระบบประชุมทางไกล</li>
                  <li className="room-feature">บริการเครื่องดื่ม</li>
                </div>

                <button onClick={() => window.location.href = "/coworking/meetingroom/mtb"} className="room-link-button">
                  จองห้องประชุม
                </button>
              </div>



              <div className="room-card">
                <div className="room-header">
                  <h3 className="room-title">Meeting Room Type C</h3>
                  <p className="room-subtitle">ห้องประชุมขนาดใหญ่ (จำนวน 5 ห้อง)</p>
                </div>
                
                <img src="https://uppic.cloud/ib/73bG9uxVY6pgl06_1744981466.jpg" className="setPic" />

                <div className="room-features-list">
                  <li className="room-feature">ความจุ 20 คน</li>
                  <li className="room-feature">โต๊ะประชุมทรงสี่เหลี่ยมผืนผ้าขนาดใหญ่</li>
                  <li className="room-feature">จอแสดงผล 75 นิ้ว</li>
                  <li className="room-feature">ระบบประชุมทางไกลคุณภาพสูง</li>
                  <li className="room-feature">ระบบเสียงรอบทิศทาง</li>
                  <li className="room-feature">บริการเครื่องดื่มและอาหารว่าง</li>
                </div>

                <button onClick={() => window.location.href = "/coworking/meetingroom/mtc"} className="room-link-button">
                  จองห้องประชุม
                </button>
              </div>


            </div>
          </div>


          <div className="content-card">
            <h2 className="section-title">ข้อมูลเพิ่มเติม</h2>
            <ul className="info-list">
              <li className="info-item"> <FaCalendarAlt className="inline-icon" />  
                สามารถจองล่วงหน้าได้สูงสุด 30 วัน
              </li>

              <li className="info-item"> <FaMicrophone className="inline-icon" />   ทุกห้องมีเครื่องปรับอากาศและอุปกรณ์เครื่องเสียง
              </li>

              <li className="info-item"> <FaTools className="inline-icon" /> 
                มีบริการช่วยเหลือด้านเทคนิคตลอดเวลาทำการ
              </li>
            </ul>
          </div>

            

        </div>
      </div>
  )
}