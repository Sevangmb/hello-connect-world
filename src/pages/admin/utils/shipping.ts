
import { ShippingAddress } from "../types/orders";

export function isValidShippingAddress(value: any): value is ShippingAddress {
  return (
    typeof value === 'object' &&
    value !== null &&
    'street' in value &&
    'city' in value &&
    'postal_code' in value &&
    'country' in value
  );
}
