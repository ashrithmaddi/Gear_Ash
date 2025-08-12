import React, { useEffect, useState } from "react";

const Profile = () => {
  // Get user from localStorage
  const [user, setUser] = useState(null);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize user from localStorage only once
  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      setUser(currentUser);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  // Fetch profile data when user is set
  useEffect(() => {
    if (!user || !user.token || !user._id) {
      console.log("No user or token found");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/student/${user._id}/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Profile data fetched:", data);
          setUserData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
          });
        } else {
          console.error("Failed to fetch profile:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user]); // Only depend on user, not userData

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("❌ File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || !user._id || !user.token) {
      alert("❌ User session expired. Please login again.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/student/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          firstName: userData.firstName.trim(),
          lastName: userData.lastName.trim(),
        }),
      });

      if (res.ok) {
        alert("✅ Profile updated!");
      } else {
        const errorData = await res.json();
        alert(`❌ Failed to update profile: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile");
    }
    setIsLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("❌ New and confirm passwords don't match");
    }

    if (passwords.newPassword.length < 6) {
      return alert("❌ Password must be at least 6 characters long");
    }

    if (!user || !user._id || !user.token) {
      alert("❌ User session expired. Please login again.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/student/${user._id}/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Password updated!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(`❌ ${data.error || data.message || 'Failed to update password'}`);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("❌ Failed to update password");
    }
    setIsLoading(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading user data...</p>
        </div>
      </div>
    );
  }

  const profileCardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '24px',
    textAlign: 'center',
    position: 'sticky',
    top: '32px'
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
    padding: '32px 16px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    marginBottom: '32px'
  };

  const headerStyle = {
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    padding: '24px',
    color: 'white'
  };

  const passwordHeaderStyle = {
    background: 'linear-gradient(to right, #f97316, #ef4444)',
    padding: '24px',
    color: 'white'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s',
    fontSize: '16px'
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    color: 'white',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  };

  const passwordButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(to right, #f97316, #ef4444)'
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            My Profile
          </h1>
          <p style={{ color: '#6b7280' }}>Manage your account settings and preferences</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {/* Profile Picture Section */}
          <div>
            <div style={profileCardStyle}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                <div style={{
                  width: '128px',
                  height: '128px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'linear-gradient(to bottom right, #60a5fa, #a78bfa)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <span style={{ fontSize: '4rem', color: 'white' }}>👤</span>
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="profilePic" 
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ fontSize: '18px' }}>📷</span>
                </label>
                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: 'none' }}
                />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                {userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {userData.email || 'Loading...'}
              </p>
              <div style={{ marginTop: '16px', fontSize: '0.75rem', color: '#9ca3af' }}>
                Click the camera icon to change your profile picture
              </div>
            </div>
          </div>

          {/* Forms Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Personal Information */}
            <div style={cardStyle}>
              <div style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>✏️</span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Personal Information</h2>
                </div>
              </div>
              
              <form onSubmit={handleSave} style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={userData.firstName || ""}
                      onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                      placeholder="Enter your first name"
                      onFocus={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={userData.lastName || ""}
                      onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                      placeholder="Enter your last name"
                      onFocus={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    style={{ ...inputStyle, backgroundColor: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' }}
                    value={userData.email || ""}
                    disabled
                    placeholder="Your email address"
                  />
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Email cannot be changed</p>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  style={{
                    ...buttonStyle,
                    opacity: isLoading ? 0.5 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.target.style.background = 'linear-gradient(to right, #2563eb, #7c3aed)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.target.style.background = 'linear-gradient(to right, #3b82f6, #8b5cf6)';
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '18px' }}>💾</span>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Password Change */}
            <div style={cardStyle}>
              <div style={passwordHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>🔒</span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Change Password</h2>
                </div>
              </div>
              
              <form onSubmit={handlePasswordUpdate} style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Current Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      style={{ ...inputStyle, paddingRight: '48px' }}
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, currentPassword: e.target.value })
                      }
                      placeholder="Enter current password"
                      onFocus={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.borderColor = '#f97316';
                        e.target.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      {showPasswords.current ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        style={{ ...inputStyle, paddingRight: '48px' }}
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({ ...passwords, newPassword: e.target.value })
                        }
                        placeholder="Enter new password"
                        onFocus={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.borderColor = '#f97316';
                          e.target.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = '#f9fafb';
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          fontSize: '18px'
                        }}
                      >
                        {showPasswords.new ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        style={{ ...inputStyle, paddingRight: '48px' }}
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({ ...passwords, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm new password"
                        onFocus={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.borderColor = '#f97316';
                          e.target.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = '#f9fafb';
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          fontSize: '18px'
                        }}
                      >
                        {showPasswords.confirm ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                    <strong>Password Requirements:</strong> Must be at least 6 characters long and contain a mix of letters and numbers for better security.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  style={{
                    ...passwordButtonStyle,
                    opacity: isLoading ? 0.5 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.target.style.background = 'linear-gradient(to right, #ea580c, #dc2626)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.target.style.background = 'linear-gradient(to right, #f97316, #ef4444)';
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '18px' }}>🔒</span>
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Profile;