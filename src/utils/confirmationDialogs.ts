import Swal, { SweetAlertResult } from 'sweetalert2';

// Type definitions
export interface ConfirmationOptions {
  title: string;
  html?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
  showInput?: boolean;
  inputPlaceholder?: string;
  inputValidator?: (value: string) => string | null;
  preConfirm?: () => any | Promise<any>;
}

export interface RejectionOptions {
  propertyTitle?: string;
  requireReason?: boolean;
}

// Default styles
const DESTRUCTIVE_BUTTON_COLOR = '#dc3545';
const WARNING_BUTTON_COLOR = '#ff9800';
const CONFIRM_BUTTON_COLOR = '#28a745';

/**
 * Generic confirmation dialog for any destructive action
 */
export const confirmAction = async (options: ConfirmationOptions): Promise<SweetAlertResult> => {
  return Swal.fire({
    title: options.title,
    html: options.html,
    text: options.text,
    icon: options.icon || 'warning',
    showCancelButton: true,
    confirmButtonColor: options.confirmButtonColor || DESTRUCTIVE_BUTTON_COLOR,
    cancelButtonColor: '#6c757d',
    confirmButtonText: options.confirmButtonText || 'Confirm',
    cancelButtonText: options.cancelButtonText || 'Cancel',
    reverseButtons: true,
    preConfirm: options.preConfirm,
  });
};

/**
 * Confirmation dialog for property rejection with reason input
 */
export const confirmPropertyRejection = async (options: RejectionOptions = {}): Promise<{ confirmed: boolean; reason?: string }> => {
  const result = await Swal.fire({
    title: 'Reject Property Verification?',
    html: `
      <div style="text-align: left; margin-bottom: 15px;">
        ${options.propertyTitle ? `<p><strong>Property:</strong> ${options.propertyTitle}</p>` : ''}
        <p style="color: #dc3545; margin-top: 10px;">
          <strong>Warning:</strong> This action cannot be undone. The property owner will be notified.
        </p>
      </div>
      <textarea 
        id="rejection-reason" 
        class="swal2-textarea" 
        placeholder="Enter rejection reason (required)..."
        style="width: 100%; min-height: 100px; resize: vertical;"
      ></textarea>
    `,
    showCancelButton: true,
    confirmButtonColor: DESTRUCTIVE_BUTTON_COLOR,
    confirmButtonText: 'Reject Property',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusConfirm: false,
    preConfirm: () => {
      const reason = (document.getElementById('rejection-reason') as HTMLTextAreaElement)?.value;
      if (!reason?.trim()) {
        Swal.showValidationMessage('Please provide a reason for rejection');
        return false;
      }
      return reason.trim();
    }
  });

  if (result.isConfirmed && result.value) {
    return { confirmed: true, reason: result.value };
  }
  return { confirmed: false };
};

/**
 * Confirmation dialog for user blocking
 */
export const confirmUserBlock = async (userName?: string): Promise<boolean> => {
  const result = await confirmAction({
    title: 'Block User?',
    html: `
      <p>${userName ? `Are you sure you want to block <strong>${userName}</strong>?` : 'Are you sure you want to block this user?'}</p>
      <p style="color: #dc3545; margin-top: 10px;">
        The user will be immediately logged out and unable to access the platform.
      </p>
    `,
    icon: 'warning',
    confirmButtonText: 'Block User',
    confirmButtonColor: DESTRUCTIVE_BUTTON_COLOR,
  });
  
  return result.isConfirmed;
};

/**
 * Confirmation dialog for user suspension
 */
export const confirmUserSuspension = async (userName?: string, duration?: string): Promise<boolean> => {
  const result = await confirmAction({
    title: 'Suspend User?',
    html: `
      <p>${userName ? `Are you sure you want to suspend <strong>${userName}</strong>?` : 'Are you sure you want to suspend this user?'}</p>
      ${duration ? `<p>Suspension duration: <strong>${duration}</strong></p>` : ''}
      <p style="color: #ff9800; margin-top: 10px;">
        The user will be temporarily unable to access the platform.
      </p>
    `,
    icon: 'warning',
    confirmButtonText: 'Suspend User',
    confirmButtonColor: WARNING_BUTTON_COLOR,
  });
  
  return result.isConfirmed;
};

/**
 * Confirmation dialog for assignment deletion
 */
export const confirmAssignmentDeletion = async (assignmentDetails?: string): Promise<boolean> => {
  const result = await confirmAction({
    title: 'Delete Assignment?',
    html: `
      ${assignmentDetails ? `<p>Assignment: <strong>${assignmentDetails}</strong></p>` : ''}
      <p style="color: #dc3545; margin-top: 10px;">
        This will permanently remove the assignment. The CS agent and property owner will be notified.
      </p>
    `,
    icon: 'error',
    confirmButtonText: 'Delete Assignment',
    confirmButtonColor: DESTRUCTIVE_BUTTON_COLOR,
  });
  
  return result.isConfirmed;
};

/**
 * Confirmation dialog for bulk operations
 */
export const confirmBulkOperation = async (
  operation: 'approve' | 'reject' | 'delete' | 'assign',
  itemCount: number,
  itemType: 'properties' | 'users' | 'assignments'
): Promise<boolean> => {
  const operationText = {
    approve: { text: 'approve', color: CONFIRM_BUTTON_COLOR, icon: 'success' as const },
    reject: { text: 'reject', color: DESTRUCTIVE_BUTTON_COLOR, icon: 'warning' as const },
    delete: { text: 'delete', color: DESTRUCTIVE_BUTTON_COLOR, icon: 'error' as const },
    assign: { text: 'assign', color: CONFIRM_BUTTON_COLOR, icon: 'info' as const },
  };

  const config = operationText[operation];
  
  const result = await confirmAction({
    title: `${operation.charAt(0).toUpperCase() + operation.slice(1)} ${itemCount} ${itemType}?`,
    html: `
      <p>You are about to ${config.text} <strong>${itemCount} ${itemType}</strong>.</p>
      <p style="color: ${config.color}; margin-top: 10px;">
        ${operation === 'delete' ? 'This action cannot be undone.' : 'This action will affect all selected items.'}
      </p>
    `,
    icon: config.icon,
    confirmButtonText: `${operation.charAt(0).toUpperCase() + operation.slice(1)} All`,
    confirmButtonColor: config.color,
  });
  
  return result.isConfirmed;
};

/**
 * Confirmation dialog for property approval
 */
export const confirmPropertyApproval = async (propertyTitle?: string): Promise<boolean> => {
  const result = await confirmAction({
    title: 'Approve Property?',
    html: `
      ${propertyTitle ? `<p>Property: <strong>${propertyTitle}</strong></p>` : ''}
      <p style="color: #28a745; margin-top: 10px;">
        This property will be marked as verified and visible to all users.
      </p>
    `,
    icon: 'success',
    confirmButtonText: 'Approve Property',
    confirmButtonColor: CONFIRM_BUTTON_COLOR,
  });
  
  return result.isConfirmed;
};

/**
 * Input dialog for adding notes
 */
export const inputNotes = async (title = 'Add Notes', placeholder = 'Enter your notes...'): Promise<{ confirmed: boolean; notes?: string }> => {
  const result = await Swal.fire({
    title,
    input: 'textarea',
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText: 'Save Notes',
    confirmButtonColor: CONFIRM_BUTTON_COLOR,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    inputValidator: (value) => {
      if (!value?.trim()) {
        return 'Please enter some notes';
      }
      return null;
    }
  });

  if (result.isConfirmed && result.value) {
    return { confirmed: true, notes: result.value };
  }
  return { confirmed: false };
};

/**
 * Success notification
 */
export const showSuccessNotification = (title: string, text?: string): void => {
  Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    position: 'top-end',
    toast: true,
  });
};

/**
 * Error notification
 */
export const showErrorNotification = (title: string, text?: string): void => {
  Swal.fire({
    icon: 'error',
    title,
    text,
    timer: 5000,
    timerProgressBar: true,
    showConfirmButton: false,
    position: 'top-end',
    toast: true,
  });
};

/**
 * Warning notification
 */
export const showWarningNotification = (title: string, text?: string): void => {
  Swal.fire({
    icon: 'warning',
    title,
    text,
    timer: 4000,
    timerProgressBar: true,
    showConfirmButton: false,
    position: 'top-end',
    toast: true,
  });
};
