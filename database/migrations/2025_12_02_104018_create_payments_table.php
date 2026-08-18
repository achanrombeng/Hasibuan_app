<?php

declare(strict_types=1);

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Payments table untuk tracking pembayaran.
     * Mendukung partial payments dan multiple payment attempts.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('payment_number')->unique();
            $table->string('method')->default(PaymentMethod::BANK_TRANSFER->value);
            $table->string('status')->default(PaymentStatus::PENDING->value);
            $table->unsignedBigInteger('amount');

            // Payment gateway info
            $table->string('gateway_reference')->nullable();
            $table->string('gateway_status')->nullable();
            $table->json('gateway_response')->nullable();

            // Bank transfer specific
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('account_holder')->nullable();
            $table->string('transfer_proof_path')->nullable();

            // Verification
            $table->foreignId('verified_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->text('verification_notes')->nullable();

            // Expiry for pending payments
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->string('failure_reason')->nullable();

            $table->timestamps();

            $table->index(['order_id', 'status']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
