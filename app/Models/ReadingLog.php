<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReadingLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'chapter_id',
        'read_date',
        'duration_seconds',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }
}
