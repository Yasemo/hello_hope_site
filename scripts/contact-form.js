// Contact Form JavaScript for Hello Hope Canada

class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.submitButton = this.form?.querySelector('.form-submit');
    this.submitText = this.form?.querySelector('.submit-text');
    this.submitLoading = this.form?.querySelector('.submit-loading');
    this.successMessage = document.getElementById('form-success');
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Add real-time validation
    const inputs = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (this.validateForm()) {
      this.submitForm();
    }
  }

  validateForm() {
    let isValid = true;
    const requiredFields = this.form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    this.clearError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      errorMessage = 'This field is required.';
      isValid = false;
    }
    // Email validation
    else if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address.';
        isValid = false;
      }
    }
    // Phone validation (optional but if provided, should be valid)
    else if (fieldName === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = value.replace(/[\s\-\(\)\.]/g, '');
      if (cleanPhone && !phoneRegex.test(cleanPhone)) {
        errorMessage = 'Please enter a valid phone number.';
        isValid = false;
      }
    }
    // Message length validation
    else if (fieldName === 'message' && value && value.length < 10) {
      errorMessage = 'Please provide a more detailed message (at least 10 characters).';
      isValid = false;
    }

    if (!isValid) {
      this.showError(field, errorMessage);
    }

    return isValid;
  }

  showError(field, message) {
    field.classList.add('error');
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  clearError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  }

  async submitForm() {
    // Show loading state
    this.setLoadingState(true);
    
    try {
      // Collect form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // Simulate form submission (replace with actual endpoint)
      await this.simulateSubmission(data);
      
      // Show success message
      this.showSuccess();
      
      // Reset form
      this.form.reset();
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError(this.form.querySelector('[name="message"]'), 'There was an error sending your message. Please try again or contact us directly.');
    } finally {
      this.setLoadingState(false);
    }
  }

  async simulateSubmission(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log form data (in production, this would be sent to a server)
    console.log('Form submission data:', data);
    
    // In a real implementation, you would send this data to your server:
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    
    return { success: true };
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.submitButton.disabled = true;
      this.submitText.style.display = 'none';
      this.submitLoading.style.display = 'inline';
    } else {
      this.submitButton.disabled = false;
      this.submitText.style.display = 'inline';
      this.submitLoading.style.display = 'none';
    }
  }

  showSuccess() {
    this.successMessage.style.display = 'block';
    this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide success message after 10 seconds
    setTimeout(() => {
      this.successMessage.style.display = 'none';
    }, 10000);
  }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ContactForm();
});
