import React, { useState } from 'react';
import { X } from 'lucide-react';

const EditAccountPopup = ({ isOpen, onClose, actionType, userData }) => {
   // Don't show if not open
   if (!isOpen) return null;

   const [loading, setLoading] = useState(false);

   // Initialize form state based on action type
   const [formData, setFormData] = useState(() => {
      switch (actionType) {
         case 'editProfile':
            // Only update profile image
            return {
               imageUrl: userData?.imageUrl || '',
            };
         case 'editName':
            return {
               name: userData?.name || '',
            };
         // For reset and forgot password, we now only need the email field
         case 'resetPassword':
            return {
               currentPAss: userData?.currentPAss || '',
               newPass: userData?.newPass || '',
            }
         case 'forgotPassword':
            return {
               email: userData?.email || '',
            };
         default:
            return {};
      }
   });

   // Handle input changes
   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   // Handle form submission
   const handleSubmit = (e) => {
      e.preventDefault();

      if (actionType === 'resetPassword' || actionType === 'forgotPassword') {
         console.log(`Sending OTP to email: ${formData.email}`);
         return;
      }

      // For other actions, simply log the data
      console.log(`Action: ${actionType}`, formData);
      onClose();
   };

   // Render form fields based on action type
   const renderFormFields = () => {
      switch (actionType) {
         case 'editProfile':
            return (
               <div className="mb-4">
                  <label htmlFor="imageUrl" className="block text-sm font-medium mb-1" style={{
                     color: 'var(--color-text-secondary-light)',
                     '@media (prefers-color-scheme: dark)': { color: 'var(--color-text-secondary-dark)' }
                  }}>
                     Profile Image
                  </label>
                  <input
                     type="file"
                     id="imageUrl"
                     name="imageUrl"
                     value={formData.imageUrl}
                     onChange={handleChange}
                     className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
                     style={{
                        backgroundColor: 'var(--color-background-light)',
                        color: 'var(--color-text-primary-light)',
                        borderColor: 'var(--color-border-light)',
                        '@media (prefers-color-scheme: dark)': {
                           backgroundColor: 'var(--color-surface-dark)',
                           color: 'var(--color-text-primary-dark)',
                           borderColor: 'var(--color-border-dark)'
                        }
                     }}
                     required
                  />
               </div>
            );
         case 'editName':
            return (
               <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-1" style={{
                     color: 'var(--color-text-secondary-light)',
                     '@media (prefers-color-scheme: dark)': { color: 'var(--color-text-secondary-dark)' }
                  }}>
                     New Name
                  </label>
                  <input
                     type="text"
                     id="name"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
                     style={{
                        backgroundColor: 'var(--color-background-light)',
                        color: 'var(--color-text-primary-light)',
                        borderColor: 'var(--color-border-light)',
                        '@media (prefers-color-scheme: dark)': {
                           backgroundColor: 'var(--color-surface-dark)',
                           color: 'var(--color-text-primary-dark)',
                           borderColor: 'var(--color-border-dark)'
                        }
                     }}
                     required
                  />
               </div>
            );
         // Both reset and forgot password use the same UI: an email input and a note about sending OTP
         case 'resetPassword':
            return (
               <>
                  <div className="mb-4">
                     {/* enter current password */}
                     <label htmlFor="email" className="block text-sm font-medium mb-1" style={{
                        color: 'var(--color-text-secondary-light)',
                        '@media (prefers-color-scheme: dark)': { color: 'var(--color-text-secondary-dark)' }
                     }}>
                        Current Password
                     </label>
                     <input
                        type="text"
                        id="currentPAss"
                        name="currentPAss"
                        value={formData.currentPAss}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
                        style={{
                           backgroundColor: 'var(--color-background-light)',
                           color: 'var(--color-text-primary-light)',
                           borderColor: 'var(--color-border-light)',
                           '@media (prefers-color-scheme: dark)': {
                              backgroundColor: 'var(--color-surface-dark)',
                              color: 'var(--color-text-primary-dark)',
                              borderColor: 'var(--color-border-dark)'
                           }
                        }}
                        required
                     />
                     {/* enter new password */}
                     <label htmlFor="email" className="block text-sm font-medium mb-1" style={{
                        color: 'var(--color-text-secondary-light)',
                        '@media (prefers-color-scheme: dark)': { color: 'var(--color-text-secondary-dark)' }
                     }}>
                        New Password
                     </label>
                     <input
                        type="text"
                        id="newPass"
                        name="newPass"
                        value={formData.newPass}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
                        style={{
                           backgroundColor: 'var(--color-background-light)',
                           color: 'var(--color-text-primary-light)',
                           borderColor: 'var(--color-border-light)',
                           '@media (prefers-color-scheme: dark)': {
                              backgroundColor: 'var(--color-surface-dark)',
                              color: 'var(--color-text-primary-dark)',
                              borderColor: 'var(--color-border-dark)'
                           }
                        }}
                        required
                     />
                  </div>
               </>
            )
         case 'forgotPassword':
            return (
               <>
                  <div className="mb-4">
                     <label htmlFor="email" className="block text-sm font-medium mb-1" style={{
                        color: 'var(--color-text-secondary-light)',
                        '@media (prefers-color-scheme: dark)': { color: 'var(--color-text-secondary-dark)' }
                     }}>
                        Email Address
                     </label>
                     <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
                        style={{
                           backgroundColor: 'var(--color-background-light)',
                           color: 'var(--color-text-primary-light)',
                           borderColor: 'var(--color-border-light)',
                           '@media (prefers-color-scheme: dark)': {
                              backgroundColor: 'var(--color-surface-dark)',
                              color: 'var(--color-text-primary-dark)',
                              borderColor: 'var(--color-border-dark)'
                           }
                        }}
                        required
                     />
                  </div>
                  <p className="text-sm mb-4" style={{
                     color: 'var(--color-text-secondary-light)',
                     '@media (prefers-color-scheme: dark)': { color: 'var(--color-text-secondary-dark)' }
                  }}>
                     We'll send you an OTP to this email address.
                  </p>
               </>
            );
         default:
            return null;
      }
   };

   // Determine the title based on action type
   const getTitle = () => {
      switch (actionType) {
         case 'editProfile':
            return 'Edit Profile';
         case 'editName':
            return 'Change Name';
         case 'resetPassword':
            return 'Reset Password';
         case 'forgotPassword':
            return 'Forgot Password';
         default:
            return 'Update Account';
      }
   };

   return (
      <>
         <div className="fixed inset-0 z-40 overflow-y-auto flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="max-w-md w-full mx-4 rounded-lg shadow-xl" style={{
               backgroundColor: 'var(--color-background-light)',
               '@media (prefers-color-scheme: dark)': { backgroundColor: 'var(--color-surface-dark)' }
            }}>
               <div className="flex justify-between items-center p-4 border-b" style={{
                  borderColor: 'var(--color-border-light)',
                  '@media (prefers-color-scheme: dark)': { borderColor: 'var(--color-border-dark)' }
               }}>
                  <h2 className="text-xl font-semibold" style={{
                     color: 'var(--color-text-primary-light)',
                     '@media (prefers-color-scheme: dark)': { color: 'var(--color-text-primary-dark)' }
                  }}>
                     {getTitle()}
                  </h2>
                  <button
                     onClick={onClose}
                     className="focus:outline-none"
                     style={{
                        color: 'var(--color-text-secondary-light)',
                        '@media (prefers-color-scheme: dark)': { color: 'var(--color-text-secondary-dark)' },
                        ':hover': {
                           color: 'var(--color-text-primary-light)',
                           '@media (prefers-color-scheme: dark)': { color: 'var(--color-text-primary-dark)' }
                        }
                     }}
                  >
                     <X className="w-5 h-5" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="p-4">
                  {renderFormFields()}

                  <div className="flex justify-end space-x-3 mt-6">
                     <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-sm font-medium border"
                        style={{
                           backgroundColor: 'var(--color-background-light)',
                           color: 'var(--color-text-secondary-light)',
                           borderColor: 'var(--color-border-light)',
                           '@media (prefers-color-scheme: dark)': {
                              backgroundColor: 'var(--color-surface-dark)',
                              color: 'var(--color-text-secondary-dark)',
                              borderColor: 'var(--color-border-dark)'
                           },
                           ':hover': {
                              backgroundColor: 'var(--color-surface-light)',
                              '@media (prefers-color-scheme: dark)': { backgroundColor: 'var(--color-background-dark)' }
                           }
                        }}
                     >
                        Cancel
                     </button>
                     <button
                        type="submit"
                        className="px-4 py-2 rounded-md text-sm font-medium border"
                        style={{
                           backgroundColor: 'var(--color-accent-light)',
                           color: 'var(--color-background-light)',
                           borderColor: 'var(--color-accent-light)',
                           '@media (prefers-color-scheme: dark)': {
                              backgroundColor: 'var(--color-accent-dark)',
                              color: 'var(--color-background-dark)',
                              borderColor: 'var(--color-accent-dark)'
                           },
                           ':hover': {
                              filter: 'brightness(90%)'
                           }
                        }}
                     >
                        Save Changes
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </>
   );
};

export default EditAccountPopup;
