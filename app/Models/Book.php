<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Book extends Model
{
    use HasSlug;

    protected $fillable = ["user_id", "title", "slug", "description", "cover"];

    public function getSlugOptions() : SlugOptions {
        return SlugOptions::create()->generateSlugsFrom('title')->saveSlugsTo('slug');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class);
    }

    public function likedByUsers()
    {
        return $this->belongsToMany(User::class, 'book_likes')->withTimestamps();
    }
}
