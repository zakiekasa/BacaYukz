<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('Profile', [
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ];

        if ($user->role === 'penulis') {
            $rules['instagram'] = ['nullable', 'string', 'max:255'];
            $rules['twitter'] = ['nullable', 'string', 'max:255'];
            $rules['saweria'] = ['nullable', 'string', 'max:255'];
        }

        $validated = $request->validate($rules);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if ($user->role === 'penulis') {
            $user->instagram = $validated['instagram'] ?? null;
            $user->twitter = $validated['twitter'] ?? null;
            $user->saweria = $validated['saweria'] ?? null;
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
