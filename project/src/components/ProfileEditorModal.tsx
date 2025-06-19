import React, { useState } from 'react';
import { useAppContext, UserProfile } from '../contexts/AppContext';
import { User, Save, X } from 'lucide-react';
import './ProfileEditorModal.css';

interface ProfileEditorModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({
  open,
  onClose,
}) => {
  const { translations, isDark, userProfile, setUserProfile } = useAppContext();
  const [editingProfile, setEditingProfile] =
    useState<UserProfile>(userProfile);

  const handleProfileSave = () => {
    setUserProfile(editingProfile);
    onClose();
    alert('Profile updated successfully!');
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-container ${isDark ? 'dark' : ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">{translations.editProfile}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <User size={32} />
            </div>
            <button className="change-avatar-btn">Change Photo</button>
          </div>
          <div className="form-section">
            <h3 className="form-section-title">{translations.personalInfo}</h3>
            <div className="form-group">
              <label className="form-label">{translations.name}</label>
              <input
                type="text"
                className="form-input"
                value={editingProfile.name}
                onChange={(e) =>
                  setEditingProfile({ ...editingProfile, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">{translations.email}</label>
              <input
                type="email"
                className="form-input"
                value={editingProfile.email}
                onChange={(e) =>
                  setEditingProfile({
                    ...editingProfile,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">{translations.phone}</label>
              <input
                type="tel"
                className="form-input"
                value={editingProfile.phone}
                onChange={(e) =>
                  setEditingProfile({
                    ...editingProfile,
                    phone: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="form-section">
            <h3 className="form-section-title">{translations.farmInfo}</h3>
            <div className="form-group">
              <label className="form-label">{translations.farmSize}</label>
              <input
                type="text"
                className="form-input"
                value={editingProfile.farmSize}
                onChange={(e) =>
                  setEditingProfile({
                    ...editingProfile,
                    farmSize: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">{translations.experience}</label>
              <input
                type="text"
                className="form-input"
                value={editingProfile.experience}
                onChange={(e) =>
                  setEditingProfile({
                    ...editingProfile,
                    experience: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            {translations.cancel}
          </button>
          <button className="save-btn" onClick={handleProfileSave}>
            <Save size={16} />
            {translations.saveProfile}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditorModal;
