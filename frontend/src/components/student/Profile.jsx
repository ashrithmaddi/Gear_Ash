import React, { useEffect, useState } from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
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

  useEffect(() => {
    if (!user || !user.token) return;

    // ✅ Updated to match new backend route
    fetch(`/api/student/${user._id}/profile`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const fullName = data.fullName || "";
        const [firstName, ...rest] = fullName.split(" ");
        const lastName = rest.join(" ");
        setUserData({
          firstName: firstName || "",
          lastName: lastName || "",
          email: data.email || "",
        });
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const fullName = `${userData.firstName} ${userData.lastName}`.trim();

    const res = await fetch(`/api/student/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ fullName }),
    });

    if (res.ok) {
      alert("✅ Profile updated!");
    } else {
      alert("❌ Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("❌ New and confirm passwords don't match");
    }

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
      alert(`❌ ${data.error}`);
    }
  };

  return (
    <div className="container my-5">
      <h2>Profile</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label>First Name:</label>
          <input
            type="text"
            className="form-control"
            value={userData.firstName}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Last Name:</label>
          <input
            type="text"
            className="form-control"
            value={userData.lastName}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
          />
        </div>
      
        <button className="btn btn-primary">Save Changes</button>
      </form>

      <hr />
      <h4>Change Password</h4>
      <form onSubmit={handlePasswordUpdate}>
        <div className="mb-3">
          <label>Current Password:</label>
          <input
            type="password"
            className="form-control"
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, currentPassword: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label>New Password:</label>
          <input
            type="password"
            className="form-control"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label>Confirm New Password:</label>
          <input
            type="password"
            className="form-control"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
          />
        </div>
        <button className="btn btn-warning">Update Password</button>
      </form>
    </div>
  );
};

export default Profile;
