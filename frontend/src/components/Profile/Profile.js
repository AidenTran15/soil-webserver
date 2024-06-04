import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import DietPlanProfile from '../DietPlan/DietPlanProfile';
import CreateDietPlan from '../DietPlan/CreateDietPlan';
import { updateUser, deleteUser as authServiceDeleteUser, fetchUserData } from '../../services/authService';
import './Profile.css';

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(user ? { ...user } : null);
  const [userProfile, setUserProfile] = useState(null); 
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (!user.dateJoined) {
        fetchUserData(user.id).then(fetchedUser => {
          setUser(fetchedUser);
          setEditedUser(fetchedUser);
        }).catch(error => {
          console.error('Failed to fetch user data:', error);
        }).finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user, setUser]);

  const handleProfileSave = (profileData) => {
    setUserProfile(profileData);
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    
    // Email format validation
    if (!editedUser.email.match(/\S+@\S+\.\S+/)) {
      toast.error('Please enter a valid email address.');
      return;
    }
  
    // Password validation
    if (newPassword && newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
  
    // Construct the updated user data
    const updatedUserData = {
      ...editedUser,
      // Update the password only if a new password was provided
      password: newPassword ? `hashed-${newPassword}` : user.password
    };
  
    try {
      const response = await updateUser(user.id, updatedUserData);
      const updatedUser = response.user;
      
      setUser(updatedUser); // Update the context
      setEditedUser(updatedUser); // Update editedUser with the new data
      setNewPassword(''); // Clear the new password field
      setEditMode(false); // Exit edit mode
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };
  
  const handleUserDeletion = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await authServiceDeleteUser(user.id);
        
        // Clear user context and redirect the user
        logout();
        navigate('/signin');
        
        toast.success('Account deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete account. Please try again.');
      }
    }
  };



  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-section">
        {editMode ? (
          <form onSubmit={handleProfileUpdate} className="profile-edit-form">
            <div className="profile-info">
              <div className="info-row">
                <label className="info-label">Username:</label>
                <input
                  className="info-value"
                  value={editedUser.username}
                  onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                  required
                />
              </div>
              <div className="info-row">
                <label className="info-label">Email:</label>
                <input
                  className="info-value"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  type="email"
                  required
                />
              </div>
              <div className="info-row">
                <label className="info-label">New Password:</label>
                <input
                  type="password"
                  className="info-value"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="profile-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          </form>
        ) : (
          <div className="profile-card">
            <h2 className="profile-title">Account Information</h2>
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">{user.username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date Joined:</span>
                <span className="info-value">{user.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="profile-actions">
                <button className="profile-action-button edit-button" onClick={() => setEditMode(true)}>Edit Profile</button>
                <button className="profile-action-button delete-button" onClick={handleUserDeletion}>Delete Account</button>
              </div>
            </div>
          </div>
        )}

        <br />
        <br />

        {userProfile ? (
          <CreateDietPlan profile={userProfile} />
        ) : (
          <DietPlanProfile onSaveProfile={handleProfileSave} />
        )}
      </div>
    </div>
  );
};

export default Profile;
