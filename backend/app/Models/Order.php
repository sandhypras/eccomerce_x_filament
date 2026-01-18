<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
protected $fillable = [
        'user_id',
        'phone',
        'shipping_address',
        'notes',
        'payment_method',
        'invoice_number',
        'total_price',
        'status',
        'payment_proof',
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
