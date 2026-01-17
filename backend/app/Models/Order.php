<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'invoice_number',
        'shipping_address',
        'phone',
        'notes',
        'payment_method',
        'payment_proof',
        'payment_status',
        'total',
        'total_price',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Alias untuk compatibility
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
