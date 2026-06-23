<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Community;

class CommunityController extends Controller
{
    /**
     * Display a listing of reading communities with filters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Community::with('creator');

        if ($request->has('search') && $request->search != '') {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->has('province') && $request->province != '' && $request->province != 'Semua') {
            $query->where('province', $request->province);
        }

        if ($request->has('city') && $request->city != '' && $request->city != 'Semua') {
            $query->where('city', $request->city);
        }

        $communities = $query->latest()->get();

        // Get unique cities and provinces for filter dropdowns
        $provinces = Community::select('province')->distinct()->orderBy('province')->pluck('province')->toArray();
        $cities = Community::select('city')->distinct()->orderBy('city')->pluck('city')->toArray();

        return Inertia::render('Home/Communities', [
            'communities' => $communities,
            'filters' => [
                'search' => $request->search ?? '',
                'province' => $request->province ?? 'Semua',
                'city' => $request->city ?? 'Semua',
            ],
            'availableProvinces' => $provinces,
            'availableCities' => $cities,
        ]);
    }

    /**
     * Store a newly created community in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|min:3|max:100|unique:communities,name',
            'description' => 'required|min:10',
            'city' => 'required|min:2|max:50',
            'province' => 'required|min:2|max:50',
            'whatsapp_url' => 'nullable|url',
            'instagram_username' => 'nullable|string|max:50',
        ]);

        $avatarUrl = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=150&h=150&q=80';

        Community::create(array_merge($validated, [
            'created_by' => auth()->id(),
            'member_count' => 1,
            'avatar_url' => $avatarUrl,
        ]));

        return redirect()->route('communities.index')->with(['success' => true, 'message' => 'Komunitas berhasil didaftarkan!']);
    }
}
