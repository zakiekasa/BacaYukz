<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        $user->avatar_url = $user->avatar 
            ? ((str_starts_with($user->avatar, 'http') || str_starts_with($user->avatar, 'data:')) ? $user->avatar : asset('storage/avatars/' . $user->avatar)) 
            : null;

        return Inertia::render('Dashboard/Profile', [
            'user' => $user,
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'daily_target_minutes' => 'required|integer|min:1|max:1440',
        ];

        if ($user->role === 'penulis') {
            $rules['instagram'] = 'nullable|string|max:255';
            $rules['twitter'] = 'nullable|string|max:255';
            $rules['saweria'] = 'nullable|url|max:255';
        }

        $validated = $request->validate($rules);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->daily_target_minutes = $validated['daily_target_minutes'];

        if ($user->role === 'penulis') {
            $user->instagram = $validated['instagram'] ?? null;
            $user->twitter = $validated['twitter'] ?? null;
            $user->saweria = $validated['saweria'] ?? null;
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar && !str_starts_with($user->avatar, 'http') && !str_starts_with($user->avatar, 'data:')) {
                Storage::disk('public')->delete('avatars/' . $user->avatar);
            }

            $file = $request->file('avatar');
            
            if (getenv('VERCEL') || getenv('LAMBDA_TASK_ROOT') || file_exists('/var/task')) {
                $imageData = file_get_contents($file->getRealPath());
                $mimeType = $file->getMimeType() ?: 'image/png';
                $avatarValue = 'data:' . $mimeType . ';base64,' . base64_encode($imageData);
            } else {
                if (extension_loaded('gd')) {
                    $fileName = Str::slug($validated['name']) . '-' . time() . '.webp';
                    $manager = new ImageManager(new Driver());
                    $image = $manager->decode($file);
                    $image->cover(300, 300);
                    $encoded = $image->encodeUsingFileExtension('webp', quality: 85);
                    Storage::disk('public')->put('avatars/' . $fileName, $encoded->toString());
                } else {
                    $extension = $file->getClientOriginalExtension() ?: 'png';
                    $fileName = Str::slug($validated['name']) . '-' . time() . '.' . $extension;
                    $file->storeAs('avatars', $fileName, 'public');
                }
                $avatarValue = $fileName;
            }

            $user->avatar = $avatarValue;
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->back()->with([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
        ]);
    }
}
