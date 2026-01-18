<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
    $table->string('phone', 20)->nullable()->after('user_id');
    $table->text('shipping_address')->nullable()->after('phone');
    $table->text('notes')->nullable()->after('shipping_address');
    $table->string('payment_method', 20)->default('transfer')->after('notes');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //
        });
    }
};
