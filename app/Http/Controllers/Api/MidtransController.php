<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Notification;

class MidtransController extends Controller
{
    public function __construct()
    {
        // Configure Midtrans before handling notifications
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production', false);
        Config::$isSanitized = config('midtrans.is_sanitized', true);
        Config::$is3ds = config('midtrans.is_3ds', true);
    }

    public function notification(Request $request): JsonResponse
    {
        try {
            // Log incoming notification for debugging
            Log::info('Midtrans notification received', [
                'body' => $request->all(),
            ]);

            // Verify server key is configured
            if (empty(Config::$serverKey)) {
                Log::error('Midtrans server key not configured');
                return response()->json(['message' => 'Server configuration error'], 500);
            }

            $notification = new Notification();

            $transactionStatus = $notification->transaction_status;
            $paymentType = $notification->payment_type;
            $orderId = $notification->order_id;
            $fraudStatus = $notification->fraud_status ?? null;

            Log::info('Midtrans notification parsed', [
                'order_id' => $orderId,
                'transaction_status' => $transactionStatus,
                'payment_type' => $paymentType,
                'fraud_status' => $fraudStatus,
            ]);

            $order = Order::where('order_number', $orderId)->first();

            if (!$order) {
                Log::warning('Order not found for Midtrans notification', ['order_id' => $orderId]);
                return response()->json(['message' => 'Order not found'], 404);
            }

            // Handle transaction status
            if ($transactionStatus == 'capture') {
                if ($paymentType == 'credit_card') {
                    if ($fraudStatus == 'accept') {
                        $this->handlePaymentSuccess($order);
                    } elseif ($fraudStatus == 'challenge') {
                        $order->update(['payment_status' => PaymentStatus::PENDING]);
                        Log::info('Order payment challenged by FDS', ['order_id' => $orderId]);
                    }
                }
            } elseif ($transactionStatus == 'settlement') {
                $this->handlePaymentSuccess($order);
            } elseif ($transactionStatus == 'pending') {
                $order->update(['payment_status' => PaymentStatus::PENDING]);
                Log::info('Order payment pending', ['order_id' => $orderId]);
            } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
                $this->handlePaymentFailure($order, $transactionStatus);
            }

            return response()->json(['message' => 'Notification processed successfully']);
        } catch (\Exception $e) {
            Log::error('Midtrans Notification Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Error processing notification'], 500);
        }
    }

    protected function handlePaymentSuccess(Order $order): void
    {
        $order->markAsPaid();
        $order->update(['status' => OrderStatus::PROCESSING]);

        // Increment sold_count for each product
        $order->load('items');
        foreach ($order->items as $item) {
            if ($item->product) {
                $item->product->incrementSoldCount($item->quantity);
            }
        }

        Log::info('Order payment successful', ['order_id' => $order->order_number]);
    }

    protected function handlePaymentFailure(Order $order, string $reason): void
    {
        $reasonMap = [
            'deny' => 'Payment Denied',
            'expire' => 'Payment Expired',
            'cancel' => 'Payment Cancelled',
        ];

        // Restore stock for each product since payment failed
        $order->load('items');
        foreach ($order->items as $item) {
            if ($item->product && $item->product->track_stock) {
                $item->product->addStock($item->quantity);
            }
        }

        $order->update([
            'payment_status' => PaymentStatus::FAILED,
            'status' => OrderStatus::CANCELLED,
            'cancelled_at' => now(),
            'cancellation_reason' => $reasonMap[$reason] ?? 'Payment Failed',
        ]);

        Log::info('Order payment failed', [
            'order_id' => $order->order_number,
            'reason' => $reason,
        ]);
    }
}
