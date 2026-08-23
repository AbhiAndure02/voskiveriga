export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;

  constructor(message: string, statusCode: number = 500, errorCode: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_REQUIRED');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class InventoryError extends AppError {
  constructor(message: string = 'Insufficient inventory stock') {
    super(message, 400, 'INSUFFICIENT_STOCK');
  }
}

export class CouponError extends AppError {
  constructor(message: string = 'Invalid coupon application') {
    super(message, 400, 'INVALID_COUPON');
  }
}

export class PaymentError extends AppError {
  constructor(message: string = 'Payment processing failed') {
    super(message, 400, 'PAYMENT_FAILED');
  }
}

export class ShippingError extends AppError {
  constructor(message: string = 'Shipment processing failed') {
    super(message, 400, 'SHIPPING_FAILED');
  }
}
