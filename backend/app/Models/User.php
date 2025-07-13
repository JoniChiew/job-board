<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    // Fillable fields for mass assignment
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    // Hide sensitive fields in JSON response
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Cast attributes
    protected $casts = [
        'email_verified_at' => 'datetime',
        'role' => 'string',
    ];

    // Send custom password reset notification
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
