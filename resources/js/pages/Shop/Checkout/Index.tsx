import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
  ArrowLeft,
  Banknote,
  Building2,
  Check,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Plus,
  Truck,
} from 'lucide-react';
import React from 'react';

interface Address {
  id: number;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  city_id: string | null;
  district: string | null;
  province: string;
  postal_code: string;
  is_default: boolean;
  full_address: string;
}

interface CartItem {
  id: number;
  quantity: number;
  unit_price_formatted: string;
  subtotal_formatted: string;
  product: {
    id: number;
    name: string;
    weight: number | null;
    images: { url: string; is_primary: boolean }[];
  };
}

interface Cart {
  items_count: number;
  subtotal: number;
  subtotal_formatted: string;
  items: CartItem[];
}

interface PaymentMethod {
  value: string;
  name: string;
  description: string;
  fee: number;
}

interface PaymentSettings {
  cod_fee: number;
  payment_deadline_hours: number;
}

interface ShippingOption {
  key: string;
  courier_code: string;
  courier_name: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

interface Props {
  cart: Cart;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  paymentSettings: PaymentSettings;
}

// Helper function to search destination by city/district name
async function searchDestinationId(
  searchQuery: string,
): Promise<string | null> {
  try {
    const response = await fetch(
      `/api/shipping/search?search=${encodeURIComponent(searchQuery)}`,
    );
    const data = await response.json();

    if (data && data.length > 0) {
      // Return the first match's ID
      return String(data[0].id);
    }
    return null;
  } catch (e) {
    console.error('Failed to search destination:', e);
    return null;
  }
}

export default function CheckoutIndex({
  cart,
  addresses,
  paymentMethods,
  paymentSettings,
}: Props) {
  const addressList = Array.isArray(addresses) ? addresses : [];
  const paymentList = Array.isArray(paymentMethods) ? paymentMethods : [];

  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'hasibuan_app';

  const safeCart: Cart = {
    items_count: cart?.items_count || 0,
    subtotal: cart?.subtotal || 0,
    subtotal_formatted: cart?.subtotal_formatted || 'Rp 0',
    items: Array.isArray(cart?.items) ? cart.items : [],
  };

  const defaultAddress =
    addressList.find((a) => a.is_default)?.id || addressList[0]?.id || null;
  const defaultPayment = paymentList[0]?.value || '';

  const { data, setData, post, processing, errors } = useForm({
    address_id: defaultAddress,
    payment_method: defaultPayment,
    shipping_method: '',
    shipping_cost: 0,
    customer_notes: '',
  });

  // Shipping State
  const [shippingOptions, setShippingOptions] = React.useState<
    ShippingOption[]
  >([]);
  const [selectedShipping, setSelectedShipping] =
    React.useState<ShippingOption | null>(null);
  const [loadingShipping, setLoadingShipping] = React.useState(false);
  const [shippingError, setShippingError] = React.useState<string | null>(null);

  // Calculate total weight from cart items (in grams)
  const calculateTotalWeight = React.useCallback(() => {
    return safeCart.items.reduce((acc, item) => {
      const weightInGrams = (item.product.weight || 1) * 1000;
      return acc + item.quantity * weightInGrams;
    }, 0);
  }, [safeCart.items]);

  // Fetch shipping options when address changes
  React.useEffect(() => {
    const fetchShippingOptions = async () => {
      if (!data.address_id) {
        setShippingOptions([]);
        setSelectedShipping(null);
        return;
      }

      const address = addressList.find((a) => a.id === data.address_id);
      if (!address) {
        setShippingOptions([]);
        setSelectedShipping(null);
        return;
      }

      setLoadingShipping(true);
      setShippingError(null);

      try {
        let destinationId = address.city_id;

        // If city_id is missing, try to auto-search using district or city name
        if (!destinationId) {
          // Try district first, then city
          const searchQuery = address.district || address.city;
          if (searchQuery) {
            destinationId = await searchDestinationId(searchQuery);
          }
        }

        if (!destinationId) {
          setShippingError(
            `Unable to locate "${address.district || address.city}" in shipping database. Please update with a valid location.`,
          );
          setShippingOptions([]);
          setLoadingShipping(false);
          return;
        }

        const weight = calculateTotalWeight();

        const response = await fetch('/api/shipping/cost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            destination: destinationId,
            weight: weight,
          }),
        });

        const result = await response.json();

        if (result.success && result.options) {
          setShippingOptions(result.options);
          // Auto-select cheapest option
          if (result.options.length > 0) {
            const cheapest = result.options[0];
            setSelectedShipping(cheapest);
            setData('shipping_method', cheapest.key);
            setData('shipping_cost', cheapest.cost);
          }
        } else {
          setShippingError(result.message || 'Failed to retrieve shipping options');
          setShippingOptions([]);
        }
      } catch (e) {
        console.error('Failed to fetch shipping options', e);
        setShippingError('An error occurred while retrieving shipping options');
        setShippingOptions([]);
      } finally {
        setLoadingShipping(false);
      }
    };

    fetchShippingOptions();
  }, [data.address_id, safeCart.items]);

  const handleShippingSelect = (option: ShippingOption) => {
    setSelectedShipping(option);
    setData('shipping_method', option.key);
    setData('shipping_cost', option.cost);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.address_id || !data.payment_method || !selectedShipping) return;

    post('/shop/checkout', {
      preserveScroll: true,
    });
  };

  const getProductImage = (product: CartItem['product']) => {
    const primary = product.images?.find((img) => img.is_primary);
    return (
      primary?.url ||
      product.images?.[0]?.url ||
      '/images/placeholder-product.svg'
    );
  };

  const shippingCost = selectedShipping?.cost || 0;

  return (
    <>
      <Head title={`Checkout - ${siteName}`} />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-sand-50 pt-8 pb-20">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <Link
              href="/shop/products"
              className="mb-6 inline-flex items-center gap-2 text-terra-600 hover:text-terra-900"
            >
              <ArrowLeft className="h-4 w-4" /> Lanjutkan Belanja
            </Link>

            <h1 className="mb-8 font-serif text-3xl text-terra-900">
              Checkout
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  {/* Shipping Address */}
                  <div className="rounded-sm bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="flex items-center gap-2 font-serif text-xl text-terra-900">
                        <MapPin className="h-5 w-5" /> Shipping Address
                      </h2>
                      <Link
                        href="/shop/addresses"
                        className="flex items-center gap-1 text-sm text-wood hover:text-terra-900"
                      >
                        <Plus className="h-4 w-4" /> Add Address
                      </Link>
                    </div>
                    {addressList.length > 0 ? (
                      <div className="space-y-3">
                        {addressList.map((addr) => (
                          <label
                            key={addr.id}
                            className={`block cursor-pointer rounded-sm border-2 p-4 transition-colors ${data.address_id === addr.id ? 'border-wood bg-wood/5' : 'border-terra-100 hover:border-terra-200'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${data.address_id === addr.id ? 'border-wood bg-wood' : 'border-terra-300'}`}
                              >
                                {data.address_id === addr.id && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="font-medium text-terra-900">
                                    {addr.label}
                                  </span>
                                  {addr.is_default && (
                                    <span className="rounded bg-wood/10 px-2 py-0.5 text-xs text-wood">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-terra-700">
                                  {addr.recipient_name} • {addr.phone}
                                </p>
                                <p className="text-sm text-terra-500">
                                  {addr.full_address}
                                </p>
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="address"
                              value={addr.id}
                              checked={data.address_id === addr.id}
                              onChange={() => setData('address_id', addr.id)}
                              className="hidden"
                            />
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <MapPin className="mx-auto mb-3 h-12 w-12 text-terra-200" />
                        <p className="mb-4 text-terra-500">
                          No saved addresses yet
                        </p>
                        <Link
                          href="/shop/addresses"
                          className="inline-flex items-center gap-2 rounded-lg bg-terra-900 px-4 py-2 text-white hover:bg-terra-800"
                        >
                          <Plus className="h-4 w-4" /> Add Address
                        </Link>
                      </div>
                    )}
                    {errors.address_id && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.address_id}
                      </p>
                    )}
                  </div>

                  {/* Shipping Method */}
                  <ShippingSection
                    options={shippingOptions}
                    selectedOption={selectedShipping}
                    onSelect={handleShippingSelect}
                    loading={loadingShipping}
                    error={shippingError}
                  />

                  {/* Payment Method */}
                  <PaymentSection
                    paymentMethods={paymentList}
                    selectedPayment={data.payment_method}
                    setSelectedPayment={(v) => setData('payment_method', v)}
                    error={errors.payment_method}
                  />
                </div>

                {/* Order Summary */}
                <OrderSummary
                  cart={safeCart}
                  getProductImage={getProductImage}
                  processing={processing}
                  selectedAddress={data.address_id}
                  selectedPayment={data.payment_method}
                  selectedShipping={selectedShipping}
                  paymentSettings={paymentSettings}
                  errors={errors}
                  shippingCost={shippingCost}
                  loadingShipping={loadingShipping}
                />
              </div>
            </form>
          </div>
        </main>
      </ShopLayout>
    </>
  );
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

interface ShippingSectionProps {
  options: ShippingOption[];
  selectedOption: ShippingOption | null;
  onSelect: (option: ShippingOption) => void;
  loading: boolean;
  error: string | null;
}

function ShippingSection({
  options,
  selectedOption,
  onSelect,
  loading,
  error,
}: ShippingSectionProps) {
  const [showAll, setShowAll] = React.useState(false);
  const INITIAL_SHOW_COUNT = 3;

  const selectedIndex = selectedOption
    ? options.findIndex((o) => o.key === selectedOption.key)
    : -1;
  const shouldShowAll = showAll || selectedIndex >= INITIAL_SHOW_COUNT;
  const visibleOptions = shouldShowAll
    ? options
    : options.slice(0, INITIAL_SHOW_COUNT);
  const hasMore = options.length > INITIAL_SHOW_COUNT;

  return (
    <div className="rounded-sm bg-white p-6">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-terra-900">
        <Package className="h-5 w-5" /> Shipping Method
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-terra-400" />
          <span className="ml-3 text-terra-500">Calculating shipping rates...</span>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : options.length === 0 ? (
        <div className="py-8 text-center">
          <Truck className="mx-auto mb-3 h-12 w-12 text-terra-200" />
          <p className="text-terra-500">
            Select a shipping address to view available courier options
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleOptions.map((option) => (
            <label
              key={option.key}
              className={`flex cursor-pointer items-center justify-between rounded-sm border-2 p-4 transition-colors ${
                selectedOption?.key === option.key
                  ? 'border-wood bg-wood/5'
                  : 'border-terra-100 hover:border-terra-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    selectedOption?.key === option.key
                      ? 'border-wood bg-wood'
                      : 'border-terra-300'
                  }`}
                >
                  {selectedOption?.key === option.key && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    <span className="font-medium text-terra-900">
                      {option.courier_name} {option.service}
                    </span>
                  </div>
                  <p className="text-sm text-terra-500">
                    {option.description} • Estimated delivery {option.etd}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-wood">
                {formatCurrency(option.cost)}
              </span>
              <input
                type="radio"
                name="shipping"
                value={option.key}
                checked={selectedOption?.key === option.key}
                onChange={() => onSelect(option)}
                className="hidden"
              />
            </label>
          ))}

          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="w-full rounded-sm border-2 border-dashed border-terra-200 py-3 text-sm font-medium text-terra-600 transition-colors hover:border-terra-300 hover:bg-terra-50"
            >
              {shouldShowAll
                ? 'Show Less'
                : `View ${options.length - INITIAL_SHOW_COUNT} More Options`}
            </button>
          )}

          <p className="text-xs text-terra-500">
            *Estimated delivery time may vary depending on local conditions.
          </p>
        </div>
      )}
    </div>
  );
}

interface PaymentSectionProps {
  paymentMethods: PaymentMethod[];
  selectedPayment: string;
  setSelectedPayment: (value: string) => void;
  error?: string;
}

function PaymentSection({
  paymentMethods,
  selectedPayment,
  setSelectedPayment,
  error,
}: PaymentSectionProps) {
  return (
    <div className="rounded-sm bg-white p-6">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-terra-900">
        <CreditCard className="h-5 w-5" /> Payment Method
      </h2>
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.value}
            className={`block cursor-pointer rounded-sm border-2 p-4 transition-colors ${selectedPayment === method.value ? 'border-wood bg-wood/5' : 'border-terra-100 hover:border-terra-200'}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${selectedPayment === method.value ? 'border-wood bg-wood' : 'border-terra-300'}`}
              >
                {selectedPayment === method.value && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  {method.value === 'bank_transfer' ? (
                    <Building2 className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Banknote className="h-5 w-5 text-green-600" />
                  )}
                  <span className="font-medium text-terra-900">
                    {method.name}
                  </span>
                  {method.fee > 0 && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">
                      +{formatCurrency(method.fee)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-terra-500">{method.description}</p>
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              value={method.value}
              checked={selectedPayment === method.value}
              onChange={() => setSelectedPayment(method.value)}
              className="hidden"
            />
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface OrderSummaryProps {
  cart: Cart;
  getProductImage: (product: CartItem['product']) => string;
  processing: boolean;
  selectedAddress: number | null;
  selectedPayment: string;
  selectedShipping: ShippingOption | null;
  paymentSettings: PaymentSettings;
  errors: Record<string, string>;
  shippingCost: number;
  loadingShipping: boolean;
}

function OrderSummary({
  cart,
  getProductImage,
  processing,
  selectedAddress,
  selectedPayment,
  selectedShipping,
  paymentSettings,
  errors,
  shippingCost,
  loadingShipping,
}: OrderSummaryProps) {
  const hasErrors = Object.keys(errors).length > 0;

  const codFee = selectedPayment === 'cod' ? paymentSettings?.cod_fee || 0 : 0;
  const subtotal = cart.subtotal || 0;
  const total = subtotal + shippingCost + codFee;

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-28 rounded-sm bg-white p-6">
        <h2 className="mb-4 font-serif text-xl text-terra-900">
          Order Summary
        </h2>

        {/* Items */}
        <div className="mb-4 max-h-60 space-y-3 overflow-y-auto">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-terra-100">
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm text-terra-900">
                  {item.product.name}
                </p>
                <p className="text-sm text-terra-500">
                  {item.quantity}x {item.unit_price_formatted}
                </p>
              </div>
              <span className="text-sm font-medium text-terra-900">
                {item.subtotal_formatted}
              </span>
            </div>
          ))}
        </div>

        <div className="mb-4 space-y-2 border-t border-terra-100 pt-4">
          <div className="flex justify-between text-terra-600">
            <span>Subtotal</span>
            <span>{cart.subtotal_formatted}</span>
          </div>
          <div className="flex justify-between text-terra-600">
            <span>Shipping Cost</span>
            <span
              className={shippingCost > 0 ? 'text-terra-900' : 'text-terra-500'}
            >
              {loadingShipping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : shippingCost > 0 ? (
                formatCurrency(shippingCost)
              ) : (
                '-'
              )}
            </span>
          </div>
          {selectedShipping && (
            <div className="text-xs text-terra-500">
              {selectedShipping.courier_name} {selectedShipping.service}
            </div>
          )}
          {codFee > 0 && (
            <div className="flex justify-between text-terra-600">
              <span>COD Fee</span>
              <span className="text-orange-600">{formatCurrency(codFee)}</span>
            </div>
          )}
        </div>

        <div className="mb-6 border-t border-terra-100 pt-4">
          <div className="flex justify-between">
            <span className="font-medium text-terra-900">Total</span>
            <span className="font-serif text-2xl text-terra-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            processing ||
            !selectedAddress ||
            !selectedPayment ||
            !selectedShipping ||
            loadingShipping
          }
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-teal-600 py-4 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Processing...
            </>
          ) : (
            'Place Order'
          )}
        </button>

        {(!selectedAddress || !selectedPayment || !selectedShipping) && (
          <p className="mt-3 text-center text-sm text-red-500">
            {!selectedAddress
              ? 'Please select a shipping address'
              : !selectedShipping
                ? 'Please select a shipping method'
                : 'Please select a payment method'}
          </p>
        )}

        {hasErrors && (
          <div className="mt-3 rounded-lg bg-red-50 p-3">
            <p className="mb-1 text-sm font-medium text-red-600">
              An error occurred:
            </p>
            <ul className="list-inside list-disc text-sm text-red-500">
              {Object.values(errors).map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
